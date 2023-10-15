
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './MyDatePicker.css';
import moment from 'moment-jalaali';

let oneDay = 60 * 60 * 24 * 1000;
let todayTimestamp = Date.now() - (Date.now() % oneDay) + (new Date().getTimezoneOffset() * 1000 * 60);

export class DatePickerComponent extends Component{
    state = {
        getMonthDetails: []
    }

    constructor(props){
        super(props);
        let year = moment().format("jYYYY");
        let month = moment().format("jMM")-1;
        let day = moment().format('jDD');

        this.state ={
            year,
            month,
            selectedDay:year+'-' + month + '-' + day,
            monthDetails:this.getMonthDetails(year,month)
        }

        this.inputRef=React.createRef();
    }

    componentDidMount() {
        window.addEventListener('click', this.addBackDrop);
        this.setDateToInput(this.state.selectedDay);
        this.inputRef.current.value=this.props.selectedDate;
    }

    setDate(val){
        debugger;
        this.inputRef.current.value=val;
    }

 
    componentWillUnmount() {
        window.removeEventListener('click', this.addBackDrop);
    }

    addBackDrop =e=> {
        if(this.state.showDatePicker && !ReactDOM.findDOMNode(this).contains(e.target)) {
            this.showDatePicker(false);
        }
    }

    showDatePicker =(showDatePicker=true)=> {
        this.setState({ showDatePicker })
    }

    daysMap =['جمعه','پنجشنبه','چهارشنبه','سه شنبه','دوشنبه','یکشنبه','شنبه'];
    monthMap=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند']

    getDayDetails= args=>{
        let date = args.index- args.firstDay;
        let day = args.index%7;
        let prevMonth=args.month-1;
        let prevYear =args.year;
        if(prevMonth<0){
            prevMonth = 11;
            prevYear--;
        }
        let prevMonthNumberOfDays = moment.jDaysInMonth(prevYear,prevMonth);
        let _date = (date < 0 ? prevMonthNumberOfDays+date : date % args.numberOfDays) + 1;
        let month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
        let timestamp = new Date(args.year, args.month, _date).getTime();
        return {
            date: _date,
            day,
            month, 
            timestamp,
            dayString: this.daysMap[day]
        }
    }

    getNumberOfDays =(year, month)=> {
        let firstDayOfMonth = year+'/'+month+'/'+1;
        var miladiDate = moment(firstDayOfMonth, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
        let firstDay = moment(miladiDate).day()+1;
        return firstDay;
    }

    getMonthDetails =(year, month)=> {
        let yearInt =parseInt(year);
        let monthInt= parseInt(month);
        if(monthInt>11)
            monthInt = 11;
        var shamsiMonth = monthInt + 1;
        let firstDayOfMonth = yearInt+'/'+shamsiMonth+'/'+1;
        var miladiDate = moment(firstDayOfMonth, 'jYYYY/jMM/jDD').format('YYYY-MM-DD');
        let firstDay = moment(miladiDate).day()+1;
        let numberOfDays =moment.jDaysInMonth(yearInt,monthInt);
        let monthArray = [];
        let rows = 6;
        let currentDay = null;
        let index = 0; 
        let cols = 7;
 
        for(let row=0; row<rows; row++) {
            for(let col=0; col<cols; col++) { 
                currentDay = this.getDayDetails({
                    index,
                    numberOfDays,
                    firstDay,
                    year,
                    month
                });
                monthArray.push(currentDay);
                index++;
            }
        }
        return monthArray;
    }

    isCurrentDay =day=> {
        return day.timestamp === todayTimestamp;
    }
 
    isSelectedDay =day=> {
        return day.timestamp === this.state.selectedDay;
    }

    getDateFromDateString =dateValue=> {
        let dateData = dateValue.split('-').map(d=>parseInt(d, 10));
        if(dateData.length < 3) 
            return null;
 
        let year = dateData[0];
        let month = dateData[1];
        let date = dateData[2];
        return {year, month, date};
    }

    getMonthStr =month=> this.monthMap[Math.max(Math.min(11, month), 0)] || 'ماه';

    getDateStringFromTimestamp =timestamp=> {
        let dateObject = new Date(timestamp);
        let month = dateObject.getMonth()+1;
        let day = dateObject.getDate();
        let year = dateObject.getFullYear();
        return  year+ '-' + (month < 10 ? '0'+month : month) + '-' + (day < 10 ? '0'+day : day);
    }

    setDate =dateData=> {
        let selectedDay = new Date(dateData.year, dateData.month-1, dateData.date).getTime();
        
        this.setState({ selectedDay })
        if(this.props.onChange) {
            this.props.onChange(moment(this.inputRef.current.value,'jYYYY-jMM-jDD').format('YYYY-MM-DD'));
        }
    }

    updateDateFromInput =()=> {
        let dateValue = this.inputRef.current.value;
        let dateData = this.getDateFromDateString(dateValue);
        if(dateData !== null) { 
            this.setDate(dateData);
            this.setState({ 
                year: dateData.year, 
                month: dateData.month-1, 
                monthDetails: this.getMonthDetails(dateData.year, dateData.month-1)
            })
        }
    }

    setDateToInput =(timestamp)=> {
        let dateString = this.getDateStringFromTimestamp(timestamp);
        this.inputRef.current.value = dateString;
    }

    onDateClick =day=> {
        this.setState({selectedDay: day.timestamp}, ()=>this.setDateToInput(day.timestamp));
        let dateString = this.getDateStringFromTimestamp(day.timestamp);
        if(this.props.onChange) {
            this.props.onChange(moment(dateString,'jYYYY-jMM-jDD').format('YYYY-MM-DD'));
        }
    }

    setYear =offset=> {
        let year = parseInt(this.state.year) + offset;
        let month = parseInt(this.state.month);
        this.setState({ 
            year,
            monthDetails: this.getMonthDetails(year, month)
        })
    }

    setMonth =offset=> {
        let year = parseInt(this.state.year);
        let month = parseInt(this.state.month) + offset;
        if(month === -1) {
            month = 11;
            year--;
        } else if(month >= 12) {
            month = 0;
            year++;
        }
        this.setState({ 
            year, 
            month,
            monthDetails: this.getMonthDetails(year, month)
        })
    }

    renderCalendar() {
        let days = this.state.monthDetails.map((day, index)=> {
            return (
                <div className={'c-day-container ' + (day.month !== 0 ? ' disabled' : '') + 
                    (this.isCurrentDay(day) ? ' highlight' : '') + (this.isSelectedDay(day) ? ' highlight-green' : '')} key={index}>
                    <div className='cdc-day'>
                        <span onClick={()=>this.onDateClick(day)}>
                            {day.date}
                        </span>
                    </div>
                </div>
            )
        })
 
        return (
            <div className='c-container'>
                <div className='cc-head'>
                    {['شنبه','یک شنبه','دوشنبه','سه شنبه','چهارشنبه','پنج شنبه','جمعه'].map((d,i)=><div key={i} className='cch-name'>{d}</div>)}
                </div>
                <div className='cc-body'>
                    {days}
                </div>
            </div>
        )
    }



    render(){
        return (
            <div className='MyDatePicker'>
                <div className='mdp-input'  onClick={()=> this.showDatePicker(true)}>
                    <input  onChange={this.updateDateFromInput} ref={this.inputRef}/>
                </div>
                {this.state.showDatePicker ? (
                    <div className='mdp-container'>
                        <div className='mdpc-head'>
                            <div className='mdpch-button'>
                                <div className='mdpchb-inner' onClick={()=> this.setYear(1)}>
                                    <span className='mdpchbi-left-arrows'></span>
                                </div>
                            </div>
                            <div className='mdpch-button'>
                                <div className='mdpchb-inner' onClick={()=> this.setMonth(1)}>
                                    <span className='mdpchbi-left-arrow'></span>
                                </div>
                            </div>
                            <div className='mdpch-container'>
                                <div className='mdpchc-year'>{this.state.year}</div>
                                <div className='mdpchc-month'>{this.getMonthStr(this.state.month)}</div>
                            </div>
                            <div className='mdpch-button'>
                                <div className='mdpchb-inner' onClick={()=> this.setMonth(-1)}>
                                    <span className='mdpchbi-right-arrow'></span>
                                </div>
                            </div>
                            <div className='mdpch-button' onClick={()=> this.setYear(-1)}>
                                <div className='mdpchb-inner'>
                                    <span className='mdpchbi-right-arrows'></span>
                                </div>
                            </div>
                        </div>
                        <div className='mdpc-body'>
                            {this.renderCalendar()}
                        </div>
                    </div>
                ) : ''}
            </div>
        )
    }
}
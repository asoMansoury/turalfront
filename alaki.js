import React, { useEffect } from 'react';
import { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import { Component } from 'react';
import { Preloader, Oval } from 'react-preloader-icon';
import { faIR } from '@material-ui/core/locale';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

export default function AsyncAutoComplete(props) {
    const [value, setValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [pages, setPages] = useState(1);
    const [totalRowNo, setTotalRowNo] = useState(0);
    const [title, setTitle] = useState('');

    const theme = createMuiTheme({
        direction: 'rtl',
        palette: {
            primary: {
                main: '#8950FC',
            },
            secondary: {
                main: '#8950FC',
            },
        },
    }, faIR);

    const rowInPage = 10;

    const width = props.width;

    const load = () => {
        console.log('load');
        axios.get('http://turalprocessingbak.asanito.com/api/InitialBalance/SearchAutComplete?Title=' + title + '&Page=' + (pages).toString() + '&Row=' + rowInPage.toString())
            .then(res => {
                setTotalRowNo(res.data.numberRows);
                let newArray = options;
                newArray.push(...res.data.initialBalanceDtos.map(x => x.id + ' ' + x.title));
                setOptions(newArray);
                setLoading(false);
            });
    }
    const loadSearch = () => {
        axios.get('http://turalprocessingbak.asanito.com/api/InitialBalance/SearchAutComplete?Title=' + title + '&Page=' + (pages).toString() + '&Row=' + rowInPage.toString())
            .then(res => {
                setTotalRowNo(res.data.numberRows);
                setOptions(res.data.initialBalanceDtos.map(x => x.id + ' ' + x.title));
                setLoading(false);
            });
    }

    const loadMore = () => {
        // let elem = document.getElementsByClassName('MuiAutocomplete-listbox')[0];
        let elem = Array.from(document.getElementsByTagName('ul')).filter(x => x.getAttribute('class').includes('MuiAutocomplete-listbox'))[0];
        if (elem == undefined)
            return;

        if (elem.scrollTop + elem.offsetHeight >= elem.scrollHeight) {
            setPages(pages => pages + 1);
        }
    }

    const loadRemain = () => {
        // let remain = [
        //     {id:'1',name:'محصول1',warehouse:'تهران',remain:10},
        //     {id:'2',name:'محصول2',warehouse:'کرج',remain:10},
        //     {id:'3',name:'محصول3',warehouse:'مشهد',remain:10},
        //     {id:'4',name:'محصول4',warehouse:'قزوین',remain:10},
        //     {id:'5',name:'محصول5',warehouse:'ساوه',remain:10},
        //     {id:'6',name:'محصول6',warehouse:'قم',remain:10},
        //     {id:'7',name:'محصول7',warehouse:'شیراز',remain:10},
        //     {id:'8',name:'محصول8',warehouse:'اصفهان',remain:10},
        //     {id:'9',name:'محصول9',warehouse:'زاهدان',remain:10},
        //     {id:'10',name:'محصول10',warehouse:'آبادان',remain:10},
        // ]
        // console.log(value)
        // props.setRemain([{name : value}]);

        // axios.get('http://turalprocessingbak.asanito.com/api/InitialBalance/SearchAutComplete?Title=' + title + '&Page=' + (pages).toString() + '&Row=' + rowInPage.toString())
        //     .then(res => {
        //          props.setRemain([{name : res.data.initialBalanceDtos.map(x => x.id + ' ' + x.title)[0]}]);
        //          alert('res')
        //     });
    }

    useEffect(() => {
        if (totalRowNo >= (pages-1) * rowInPage) {
            setLoading(true);
            load();
        }
    }, [pages]);

    useEffect(() => {
        setLoading(true);
        loadSearch();
    }, [title])

    useEffect(() => {
        document.getElementById('preloader-' + props.id).style.marginRight = (document.getElementById(props.id).offsetWidth - 75) + 'px';
    });

    return (
        <ThemeProvider theme={theme}>
            <div dir="rtl" style={{ width: width }} id={props.id}>
                <StylesProvider jss={jss}>
                    <div style={{ width: '100%' }}>
                        <div id={'preloader-' + props.id} style={{ display: (isOpen && loading) ? 'block' : 'none', height: 0, position: 'relative', top: '7px' }}>
                            <Preloader
                                use={Oval}
                                size={20}
                                strokeWidth={8}
                                strokeColor="#8950FC"
                                duration={500}
                            />
                        </div>
                        <Autocomplete
                            value={value}
                            loading={loading}
                            fullWidth
                            onChange={(event, newValue) => {
                                setValue(newValue);
                                loadRemain();
                            }}
                            inputValue={inputValue}
                            onInputChange={(event, newInputValue) => {
                                setInputValue(newInputValue);
                                setTitle(newInputValue);
                                setTimeout(() => {
                                    // if (document.getElementsByClassName('MuiAutocomplete-listbox')[0] != undefined)
                                    //     document.getElementsByClassName('MuiAutocomplete-listbox')[0].addEventListener('scroll', loadMore);
                                    if (Array.from(document.getElementsByTagName('ul')).filter(x => x.getAttribute('class').includes('MuiAutocomplete-listbox'))[0] != undefined)
                                        Array.from(document.getElementsByTagName('ul')).filter(x => x.getAttribute('class').includes('MuiAutocomplete-listbox'))[0].addEventListener('scroll', loadMore);
                                }, 1000);

                                setPages(1);
                                setLoading(true);
                            }}
                            onOpen={() => {
                                setIsOpen(true);
                                load();
                                setTimeout(() => {
                                    // if (document.getElementsByClassName('MuiAutocomplete-listbox')[0] != undefined) 
                                    //     document.getElementsByClassName('MuiAutocomplete-listbox')[0].addEventListener('scroll', loadMore);
                                    if (Array.from(document.getElementsByTagName('ul')).filter(x => x.getAttribute('class').includes('MuiAutocomplete-listbox'))[0] != undefined)
                                        Array.from(document.getElementsByTagName('ul')).filter(x => x.getAttribute('class').includes('MuiAutocomplete-listbox'))[0].addEventListener('scroll', loadMore);
                                }, 1000);
                            }}
                            onClose={() => {
                                setIsOpen(false);
                                setLoading(true);
                                setOptions([]);
                                setPages(1);
                            }}
                            options={options}
                            renderInput={(params) => <TextField {...params} label="محصولات" variant="outlined" size='small' />}
                        />
                    </div>
                </StylesProvider>
            </div>
        </ThemeProvider>
    );
}
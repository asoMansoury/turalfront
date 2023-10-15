/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { shallowEqual, useSelector,useDispatch } from "react-redux";

import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import {balancestocManagePath
        ,stockroomManagePath
        ,categoryPath
        ,processListPath
        ,processPath
        ,flowProcessAddPath
        ,flowProcessListPath
        ,CostCateogryPath
        ,CostListPath
        ,usersPath
        ,processDefinitionPath
        ,balancestocFinal
        ,ProductListPath
        ,ReportProductPath
        ,DashboardPath
        ,WastagePath
    } from '../../../../../app/pages/commonConstants/RouteConstant';
export function HeaderMenu({ layoutProps }) {
    const tokenObject = useSelector(state=>state.tokenReducer.TokenObject.userInfo.controllerDtos);
    const actionsPermission =useSelector(state=>state.tokenReducer.TokenObject.userInfo.actionDtos);
    const location = useLocation();
    const getMenuItemActive = (url) => {
        return checkIsActive(location, url) ? "menu-item-active" : "";
    }
    return <div
        id="kt_header_menu"
        className={`header-menu header-menu-mobile ${layoutProps.ktMenuClasses}`}
        {...layoutProps.headerMenuAttributes}
    >
        {/*begin::Header Nav*/}
        <ul className={`menu-nav ${layoutProps.ulClasses}`}>
            {
            tokenObject!=undefined&&actionsPermission!=undefined?
            <>
            {/*begin::1 Level*/}
            <li className={`menu-item menu-item-rel ${getMenuItemActive(DashboardPath)}`}>
                <NavLink className="menu-link" to={DashboardPath}>
                    <span className="menu-text">داشبورد</span>
                    {layoutProps.rootArrowEnabled && (<i className="menu-arrow" />)}
                </NavLink>
            </li>
            {/*end::1 Level*/}
            {
                tokenObject.find(z=>z.id==7||z.id==15||z.id===6||z.id===12)!==undefined?

            <li
                data-menu-toggle={layoutProps.menuDesktopToggle}
                aria-haspopup="true"
                className={`menu-item menu-item-submenu menu-item-rel ${getMenuItemActive('/a')}`}>
                <NavLink className="menu-link menu-toggle" to="/a">
                    <span className="menu-text">محصولات</span>
                    <i className="menu-arrow"></i>
                </NavLink>
                <div className="menu-submenu menu-submenu-classic menu-submenu-left">
                    <ul className="menu-subnav">
                        {/*begin::2 Level*/}
                        {
                            tokenObject.find(z=>z.id==7)!==undefined?
                            <li
                            className={`menu-item menu-item-submenu ${getMenuItemActive(balancestocManagePath)}`}
                            data-menu-toggle="hover"
                            aria-haspopup="true"
                        >
                            <NavLink className="menu-link" to={balancestocManagePath}>
                                <span className="svg-icon menu-icon">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/Design/PenAndRuller.svg")} />
                                </span>
                                <span className="menu-text">
                                    مواد اولیه
                                </span>
                            </NavLink>
                        </li>
                        :
                        <></>
                        }
                          {/*begin::2 Level*/}
                          {
                            actionsPermission.find(z=>z.id==62)!==undefined?
                            <li
                            className={`menu-item menu-item-submenu ${getMenuItemActive(ReportProductPath)}`}
                            data-menu-toggle="hover"
                            aria-haspopup="true"
                        >
                            <NavLink className="menu-link" to={ReportProductPath}>
                                <span className="svg-icon menu-icon">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/Layout/Layout-left-panel-1.svg")} />
                                </span>
                                <span className="menu-text">
                                    محصولات نهایی
                                </span>
                            </NavLink>
                        </li>
                            :<></>
                        }

                        {/*end::2 Level*/}
                        {
                            tokenObject.find(z=>z.id==15)!==undefined?
                            <li
                            className={`menu-item menu-item-submenu ${getMenuItemActive(WastagePath)}`}
                            data-menu-toggle="hover"
                            aria-haspopup="true"
                        >
                            <NavLink className="menu-link" to={WastagePath}>
                                <span className="svg-icon menu-icon">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/Design/PenAndRuller.svg")} />
                                </span>
                                <span className="menu-text">
                                    ضایعات
                                </span>
                            </NavLink>
                        </li>
                        :
                        <></>
                        }
                        {/*end::2 Level*/}

                        {/*begin::2 Level*/}
                        {
                            tokenObject.find(z=>z.id==6)!==undefined?
                            <li
                            className={`menu-item menu-item-submenu ${getMenuItemActive(categoryPath)}`}
                            data-menu-toggle="hover"
                            aria-haspopup="true">
                            <NavLink className="menu-link" to={categoryPath}>
                                <span className="svg-icon menu-icon">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/Layout/Layout-left-panel-1.svg")} />
                                </span>
                                <span className="menu-text">
                                    دسته بندی
                                </span>
                            </NavLink>
                        </li>
                            :
                            <></>
                        }

                        {/*end::2 Level*/}

                        {/*begin::2 Level*/}
                        {
                            tokenObject.find(z=>z.id==12)!==undefined?
                            <li
                            className={`menu-item menu-item-submenu ${getMenuItemActive(stockroomManagePath)}`}
                            data-menu-toggle="hover"
                            aria-haspopup="true"
                        >
                            <NavLink className="menu-link" to={stockroomManagePath}>
                                <span className="svg-icon menu-icon">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/Navigation/Arrow-from-left.svg")} />
                                </span>
                                <span className="menu-text">
                                    انبار
                                </span>
                            </NavLink>
                        </li>
                        :
                        <></>

                        }

                        {/*end::2 Level*/}


                    </ul>
                </div>
            </li>
            
            :<></>
            }
            {/*end::1 Level*/}

            {/*begin::1 Level*/}
            {
                tokenObject.find(z=>z.id==9)!==undefined?
                <li
                data-menu-toggle={layoutProps.menuDesktopToggle}
                aria-haspopup="true"
                className={`menu-item menu-item-submenu menu-item-rel ${getMenuItemActive('/a')}`}>
                <NavLink className="menu-link menu-toggle" to="/a">
                    <span className="menu-text">فرآیند </span>
                    <i className="menu-arrow"></i>
                </NavLink>
                <div className="menu-submenu menu-submenu-classic menu-submenu-left">
                    <ul className="menu-subnav">
                        {/*begin::2 Level*/}
                        <li
                            className={`menu-item menu-item-submenu ${getMenuItemActive(processPath)}`}
                            data-menu-toggle="hover"
                            aria-haspopup="true"
                        >
                            <NavLink className="menu-link" to={processPath}>
                                <span className="svg-icon menu-icon">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/Design/PenAndRuller.svg")} />
                                </span>
                                <span className="menu-text">
                                    ایجاد فرایند جدید
                                </span>
                            </NavLink>
                        </li>
                        {/*end::2 Level*/}

                        {/*begin::2 Level*/}
                        <li
                            className={`menu-item menu-item-submenu ${getMenuItemActive(processListPath)}`}
                            data-menu-toggle="hover"
                            aria-haspopup="true"
                        >
                            <NavLink className="menu-link" to={processListPath}>
                                <span className="svg-icon menu-icon">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/Navigation/Arrow-from-left.svg")} />
                                </span>
                                <span className="menu-text">
                                     فرایندها
                                </span>
                            </NavLink>
                        </li>
                        {/*end::2 Level*/}

                        
                        {/*begin::2 Level*/}
                        <li
                            className={`menu-item menu-item-submenu ${getMenuItemActive(processDefinitionPath)}`}
                            data-menu-toggle="hover"
                            aria-haspopup="true"
                        >
                            <NavLink className="menu-link" to={processDefinitionPath}>
                                <span className="svg-icon menu-icon">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/Navigation/Arrow-from-left.svg")} />
                                </span>
                                <span className="menu-text">
                                     نوع فرایند
                                </span>
                            </NavLink>
                        </li>
                        {/*end::2 Level*/}
                    </ul>
                </div>
            </li>
            
                :<></>
            }

            {/*end::1 Level*/}

            {/*begin::1 Level*/}
            {
                tokenObject.find(z=>z.id==9)!==undefined?
                <li
                data-menu-toggle={layoutProps.menuDesktopToggle}
                aria-haspopup="true"
                className={`menu-item menu-item-submenu menu-item-rel ${getMenuItemActive('/a')}`}>
                <NavLink className="menu-link menu-toggle" to="/a">
                    <span className="menu-text">خروجی  فرایند </span>
                    <i className="menu-arrow"></i>
                </NavLink>
                <div className="menu-submenu menu-submenu-classic menu-submenu-left">
                    <ul className="menu-subnav">
                        {/*begin::2 Level*/}
                        <li
                            className={`menu-item menu-item-submenu ${getMenuItemActive(flowProcessAddPath)}`}
                            data-menu-toggle="hover"
                            aria-haspopup="true"
                        >
                            <NavLink className="menu-link" to={flowProcessAddPath}>
                                <span className="svg-icon menu-icon">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/Design/PenAndRuller.svg")} />
                                </span>
                                <span className="menu-text">
                                    ایجاد خروجی جدید 
                                </span>
                            </NavLink>
                        </li>
                        {/*end::2 Level*/}

                        {/*begin::2 Level*/}
                        <li
                            className={`menu-item menu-item-submenu ${getMenuItemActive(flowProcessListPath)}`}
                            data-menu-toggle="hover"
                            aria-haspopup="true"
                        >
                            <NavLink className="menu-link" to={flowProcessListPath}>
                                <span className="svg-icon menu-icon">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/Navigation/Arrow-from-left.svg")} />
                                </span>
                                <span className="menu-text">
                                     خروجی فرایندها
                                </span>
                            </NavLink>
                        </li>
                        {/*end::2 Level*/}
                    </ul>
                </div>
            </li>
            :<></>
            }

            {/*end::1 Level*/}

            {/*begin::1 Level*/}
            {
                tokenObject.find(z=>z.id==4)!==undefined?

            <li
                data-menu-toggle={layoutProps.menuDesktopToggle}
                aria-haspopup="true"
                className={`menu-item menu-item-submenu menu-item-rel ${getMenuItemActive('/a')}`}>
                <NavLink className="menu-link menu-toggle" to="/a">
                    <span className="menu-text">مدیریت هزینه  </span>
                    <i className="menu-arrow"></i>
                </NavLink>
                <div className="menu-submenu menu-submenu-classic menu-submenu-left">
                    <ul className="menu-subnav">
                        {/*begin::2 Level*/}
                        {
                            tokenObject.find(z=>z.id==4)!==undefined?
                            <li
                            className={`menu-item menu-item-submenu ${getMenuItemActive(CostListPath)}`}
                            data-menu-toggle="hover"
                            aria-haspopup="true"
                        >
                            <NavLink className="menu-link" to={CostListPath}>
                                <span className="svg-icon menu-icon">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/Navigation/Arrow-from-left.svg")} />
                                </span>
                                <span className="menu-text">
                                     هزینه ها
                                </span>
                            </NavLink>
                        </li>
                        :<></>
                        }

                        {/*end::2 Level*/}
                        {/*begin::2 Level*/}
                        {
                            tokenObject.find(z=>z.id==3)!==undefined?
                            <li
                            className={`menu-item menu-item-submenu ${getMenuItemActive(CostCateogryPath)}`}
                            data-menu-toggle="hover"
                            aria-haspopup="true"
                        >
                            <NavLink className="menu-link" to={CostCateogryPath}>
                                <span className="svg-icon menu-icon">
                                    <SVG src={toAbsoluteUrl("/media/svg/icons/Design/PenAndRuller.svg")} />
                                </span>
                                <span className="menu-text">
                                     سرفصل هزینه ها 
                                </span>
                            </NavLink>
                        </li>
                        :<></>
                        }

                        {/*end::2 Level*/}


                    </ul>
                </div>
            </li>
            
            :<></>
            }
            {/*end::1 Level*/}
            {
            tokenObject.find(z=>z.id==2)!==undefined?
                <li className={`menu-item menu-item-rel ${getMenuItemActive(usersPath)}`}>
                    <NavLink className="menu-link" to={usersPath}>
                        <span className="menu-text">کاربران</span>
                        {layoutProps.rootArrowEnabled && (<i className="menu-arrow" />)}
                    </NavLink>
                </li>
                :<></>
            }
                    
                    </>
                :<></>
            }
        </ul>
        {/*end::Header Nav*/}
    </div>;
}

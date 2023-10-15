/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import {useLocation} from "react-router";
import {NavLink}  from "react-router-dom";
import SVG from "react-inlinesvg";
import {flowProcessAddPath
    ,balancestocManagePath
    ,ReportProductPath
    ,processPath
} from '../../../../../app/pages/commonConstants/RouteConstant';
import { shallowEqual, useSelector,useDispatch } from "react-redux";
import {toAbsoluteUrl, checkIsActive} from "../../../../_helpers";
export function AsideMenuList({ layoutProps }) {
    const controllerPersmission = useSelector(state=>state.tokenReducer.TokenObject.userInfo.controllerDtos);
    const actionsPermission =useSelector(state=>state.tokenReducer.TokenObject.userInfo.actionDtos);
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
        ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
        : "";
  };

  return (
      <>
      {
          controllerPersmission!=undefined&&actionsPermission!=undefined?
            <>
        {/* begin::Menu Nav */}
        <ul className={`menu-nav ${layoutProps.ulClasses}`}>
          {/* begin::section */}
          <li className="menu-section ">
            <h4 className="menu-text">منو کاری</h4>
            <i className="menu-icon flaticon-more-v2"></i>
          </li>
          {/* end:: section */}

          {/* Bootstrap */}
          {/*begin::1 Level*/}
          {
              controllerPersmission.find(z=>z.id==7)!==undefined?
              <li
              className={`menu-item ${getMenuItemActive({balancestocManagePath})}`}
              aria-haspopup="true">
              <NavLink className="menu-link" to={balancestocManagePath}>
                  <span className="svg-icon menu-icon">
                      <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Mask.svg")}/>
                  </span>
                  <span className="menu-text">مواد اولیه</span>
              </NavLink>
            </li>
              :<></>
          }

            {/* Inputs */}
        {/*begin::1 Level*/}
        {
            actionsPermission.find(z=>z.id==62)!==undefined?
            <li
            className={`menu-item ${getMenuItemActive({ReportProductPath})}`}
            aria-haspopup="true">
            <NavLink className="menu-link" to={ReportProductPath}>
                <span className="svg-icon menu-icon">
                    <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Position.svg")}/>
                </span>
                <span className="menu-text">لیست محصولات نهایی</span>
            </NavLink>
        </li>
            :<></>
        }

            {/* Inputs */}
        {/*begin::1 Level*/}
        {
            actionsPermission.find(z=>z.id==81)!==undefined?
            <li
                className={`menu-item ${getMenuItemActive({processPath})}`}
                aria-haspopup="true">
                <NavLink className="menu-link" to={processPath}>
                    <span className="svg-icon menu-icon">
                        <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Image.svg")}/>
                    </span>
                    <span className="menu-text">ایجاد فرایند</span>
                </NavLink>
            </li>
            :<></>
        }

        {/* Inputs */}
                {/*begin::1 Level*/}
                {
                    actionsPermission.find(z=>z.id==32||z.id==35)!==undefined?
                    <li
                        className={`menu-item ${getMenuItemActive({flowProcessAddPath})}`}
                        aria-haspopup="true">
                        <NavLink className="menu-link" to={flowProcessAddPath}>
                            <span className="svg-icon menu-icon">
                                <SVG src={toAbsoluteUrl("/media/svg/icons/Design/Bucket.svg")}/>
                            </span>
                            <span className="menu-text">ایجاد خروجی</span>
                        </NavLink>
                    </li>
                    :<></>
                }

        </ul>

        {/* end::Menu Nav */}
            </>
          :<></>
      }

      </>
  );
}

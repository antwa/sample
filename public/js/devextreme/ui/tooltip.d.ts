/**
* DevExtreme (ui/tooltip.d.ts)
* Version: 18.1.5
* Build date: Fri Jul 27 2018
*
* Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxTooltip(): JQuery;
    dxTooltip(options: "instance"): DevExpress.ui.dxTooltip;
    dxTooltip(options: string): any;
    dxTooltip(options: string, ...params: any[]): any;
    dxTooltip(options: DevExpress.ui.dxTooltipOptions): JQuery;
}
}
export default DevExpress.ui.dxTooltip;
export type IOptions = DevExpress.ui.dxTooltipOptions;
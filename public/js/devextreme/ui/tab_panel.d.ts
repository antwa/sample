/**
* DevExtreme (ui/tab_panel.d.ts)
* Version: 18.1.5
* Build date: Fri Jul 27 2018
*
* Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxTabPanel(): JQuery;
    dxTabPanel(options: "instance"): DevExpress.ui.dxTabPanel;
    dxTabPanel(options: string): any;
    dxTabPanel(options: string, ...params: any[]): any;
    dxTabPanel(options: DevExpress.ui.dxTabPanelOptions): JQuery;
}
}
export default DevExpress.ui.dxTabPanel;
export type IOptions = DevExpress.ui.dxTabPanelOptions;
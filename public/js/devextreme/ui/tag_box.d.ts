/**
* DevExtreme (ui/tag_box.d.ts)
* Version: 18.1.5
* Build date: Fri Jul 27 2018
*
* Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxTagBox(): JQuery;
    dxTagBox(options: "instance"): DevExpress.ui.dxTagBox;
    dxTagBox(options: string): any;
    dxTagBox(options: string, ...params: any[]): any;
    dxTagBox(options: DevExpress.ui.dxTagBoxOptions): JQuery;
}
}
export default DevExpress.ui.dxTagBox;
export type IOptions = DevExpress.ui.dxTagBoxOptions;
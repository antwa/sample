/**
* DevExtreme (viz/tree_map.d.ts)
* Version: 18.1.5
* Build date: Fri Jul 27 2018
*
* Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxTreeMap(): JQuery;
    dxTreeMap(options: "instance"): DevExpress.viz.dxTreeMap;
    dxTreeMap(options: string): any;
    dxTreeMap(options: string, ...params: any[]): any;
    dxTreeMap(options: DevExpress.viz.treeMap.dxTreeMapOptions): JQuery;
}
}
export default DevExpress.viz.dxTreeMap;
export type IOptions = DevExpress.viz.treeMap.dxTreeMapOptions;
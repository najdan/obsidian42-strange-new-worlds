//wrapper element for references area. shared between popover and sidepane

import { getReferencesCache } from "src/indexer";
import ThePlugin from "src/main";
import { Link } from "src/types";
import { getUIC_Ref_Item } from "./uic-ref-item";
import { getUIC_ref_title_DivEnd, getUIC_Ref_Title_DivStart } from "./uic-ref-title";


let thePlugin: ThePlugin;

export function setPluginVariableUIC_RefArea(plugin: ThePlugin) {
    thePlugin = plugin;
}

export const getUIC_Ref_Area = async (refType: string, key: string, link: string, isPopover:boolean): Promise<string> => {
    let response = "";
    response += await getUIC_Ref_Title_DivStart(link, isPopover); //get title header for this reference ara
    response += await getUIC_ref_title_DivEnd();                  //get the ending html 
    response += `<div class="snw-ref-area">`;
    response += await htmlForReferences(key, link);
    response += `</div>`;
    return response;
}


const htmlForReferences = async (key: string, link: string): Promise<string> => {
    let refCache: Link[] = getReferencesCache()[link];
    if(refCache === undefined) refCache = getReferencesCache()[thePlugin.app.workspace.activeLeaf.view.file.basename + "#^" + key];            
    const sortedCache = (await sortRefCache(refCache)).slice(0, thePlugin.settings.displayNumberOfFilesInTooltip);    
    let response = ``;

    for (const ref of sortedCache) {
        response += await getUIC_Ref_Item(ref);
    }

    return response;
}


const sortRefCache = async (refCache: Link[]): Promise<Link[]> => {
    return refCache.sort((a,b)=>{
        return a.sourceFile.basename.localeCompare(b.sourceFile.basename) ||
               Number(a.reference.position.start.line) - Number(b.reference.position.start.line);
    });
}

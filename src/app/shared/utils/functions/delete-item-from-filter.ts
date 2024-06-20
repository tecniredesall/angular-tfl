import { findIndex } from 'rxjs/operators';
import { ITRFilter } from '../../models/filter-data.model';
import { ITag, TagType } from '../../models/tags.model';

export const deleteItemFilter = (
    filter: ITRFilter,
    property: string
): ITRFilter => {
    if (filter.hasOwnProperty(property)) {
        filter[property] = null;
    }
    return filter;
};

export const deleteArrayItemFilter = (
    filter: ITRFilter,
    property: string,
    reference: number | string
): ITRFilter => {
    if (
        filter.hasOwnProperty(property) &&
        Array.isArray(filter[property]) &&
        filter[property].length > reference
    ) {
        filter[property].splice(reference, 1);
    }
    return filter;
};

export const deleteObjectItemFilter = (
    filter: ITRFilter,
    property: string
): ITRFilter => {
    if (filter.hasOwnProperty(property)) {
        filter[property] = {};
    }
    return filter;
};


export const deleteSelectedItemFilter = (
    filter: ITRFilter,
    property: string,
    index:number
): ITRFilter => {
    if (filter.hasOwnProperty(property)) {
        filter[property].selected.splice(index,1)
    }
    return filter;
};


export const deleteUsersItemFilter = (
    filter: ITRFilter,
    property: string,
    index:number
): ITRFilter => {
    if (filter.hasOwnProperty(property)) {
        filter[property].users.splice(index,1)
    }
    return filter;
};

export const deleteCustomSelectItemFilter = (
    filter: ITRFilter,
    property: string,
    index:number
): ITRFilter => {
    if (filter.hasOwnProperty(property)) {
         const inx = filter[property].status.findIndex(x=> x.order == index)
         filter[property].status[inx].selected = false
    }
    return filter;
};

export const deleteItemFilterStatus = (
    filter: ITRFilter,
    property: string,
    index:number
): ITRFilter => {
    if (filter.hasOwnProperty(property)) {
         const inx = filter[property].filters.findIndex(x=> x.order == index)
         filter[property].filters[inx].selected = false
    }
    return filter;
};

export const  onDeleteTag = (tag: ITag , filterData): any => {
    if(tag.type == TagType.Selected){
        filterData = deleteSelectedItemFilter(filterData, tag.property, Number(tag.reference));
     }

    if(tag.type == TagType.Array){
       filterData = deleteArrayItemFilter(filterData, tag.property, tag.reference);
    }

    if(tag.type == TagType.Object){
        filterData = deleteObjectItemFilter(filterData, tag.property);
     }

     if(tag.type == TagType.Users){
        filterData = deleteUsersItemFilter(filterData, tag.property , Number(tag.reference));
     }

     if(tag.type == TagType.CustomSelected){
        filterData = deleteCustomSelectItemFilter(filterData, tag.property , Number(tag.reference));
     }

     if(tag.type == TagType.DeleteItemFilterStatus){
        filterData = deleteItemFilterStatus(filterData, tag.property , Number(tag.reference));
     }
     return filterData
}

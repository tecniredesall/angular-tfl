import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ITag } from '../../models/tags.model';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent  {
  @Input() tags: ITag[] = [];
  @Input() keyStorageFilter: string;
  @Output() eventOnDeleteTag = new EventEmitter<ITag>();

  onDeleteTag(tag: ITag){
    this.tags.splice(this.tags.indexOf(tag), 1);
    if (this.keyStorageFilter)
    {
        localStorage.setItem(this.keyStorageFilter,JSON.stringify(this.tags))
    }
    this.eventOnDeleteTag.emit(tag);
  }
}


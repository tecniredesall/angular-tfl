import * as moment from "moment";

export interface ICommentModel {
    date: moment.Moment;
    comment: string;
}

export class CommentModel implements ICommentModel{
    public date: moment.Moment =  null;
    public comment: string = '';

    constructor(item: any) {
        this.date = item.date ? moment(item.date) : this.date;
        this.comment = item.comment ?? this.comment;
    }

}

import { Injectable } from '@nestjs/common';
import {ReducedIssue, User, Youtrack, Issue} from "youtrack-rest-client";
import { IssueCustomFieldValue } from 'youtrack-rest-client/dist/entities/issueCustomField';
import { duration } from './utils';

class Deadline{
  startDate: IssueCustomFieldValue;
  interval: IssueCustomFieldValue;
  hardDeadline: {
    index: number;
    value: IssueCustomFieldValue;
  };
  softDeadline: {
    index: number;
    value: IssueCustomFieldValue;
  };
}
@Injectable()
export class AppService {
  config = {
    baseUrl: process.env.BASE_URL,
    token: process.env.TOKEN
  };
  youtrack = new Youtrack(this.config);
  getHello(): string {
    // youtrack.users.current().then((user: User) => {
    //   console.log({user});
    // });
    this.youtrack.issues.search('project: Manuspect ').then((issues: ReducedIssue[]) => { //Этапы внедрения: pre-prototype Сцен
      issues.map((mapIssue)=>{
        this.youtrack.issues.byId(mapIssue.id).then((issue: Issue) => {
          let deadline = new Deadline()
          const fileds = issue.fields
          let index: number = 0;
          fileds.map((filed)=>{
            if (filed.name == "Start date"){
              // console.log("Start date")
              deadline.startDate = filed.value
            }
            else if (filed.name == "Hard interval"){
              // console.log("Hard interval")
              deadline.interval = filed.value
            }
            else if (filed.name == "Soft deadline"){
              // console.log("Soft deadline")
              deadline.softDeadline = {index: index, value: filed.value}
            }
            else if (filed.name == "Hard deadline"){
              // console.log("HardDeadline")
              deadline.hardDeadline = {index: index, value: filed.value}
            }
            index += 1
          })
          if (deadline.interval){
            console.log(deadline)
            const hardDeadlineValue: IssueCustomFieldValue = duration(deadline.interval.id as string, deadline.startDate as number) as IssueCustomFieldValue
            if (hardDeadlineValue != deadline.hardDeadline.value){
              const hardDeadline = fileds[deadline.hardDeadline.index]
              hardDeadline.value = hardDeadlineValue
              console.log("Before: " + new Date(deadline.hardDeadline.value as number))
              console.log("Now: " + new Date(hardDeadlineValue as number))
              fileds[deadline.hardDeadline.index] = hardDeadline
              console.log(mapIssue.summary)
              this.youtrack.issues.update({id: issue.id, fields: fileds})
            } 
          }
        })
      })
    });
    return 'Hello World!';
  }
}

import { Injectable } from '@nestjs/common';
import {ReducedIssue, User, Youtrack, Issue} from "youtrack-rest-client";
import { IssueCustomFieldValue } from 'youtrack-rest-client/dist/entities/issueCustomField';
import { duration } from './utils';

class Deadline{
  startDate: {
    index: number;
    value: IssueCustomFieldValue;
  };
  interval: {
    index: number;
    value: IssueCustomFieldValue;
  };
  hardDeadline: {
    index: number;
    value: IssueCustomFieldValue;
  };
  softDeadline: {
    index: number;
    value: IssueCustomFieldValue;
  };
  stage: {
    index: number;
    value: IssueCustomFieldValue;
  }
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
    this.youtrack.issues.search('project: Manuspect').then((issues: ReducedIssue[]) => { //Этапы внедрения: pre-prototype Сцен
      issues.map((mapIssue)=>{
        this.youtrack.issues.byId(mapIssue.id).then((issue: Issue) => {
          let deadline = new Deadline()
          const fileds = issue.fields
          let index: number = 0;
          fileds.map((filed)=>{
            if (filed.name == "Start date"){
              // console.log("Start date")
              deadline.startDate = {index: index, value: filed.value}
            }
            else if (filed.name == "Hard interval"){
              // console.log("Hard interval")
              deadline.interval = {index: index, value: filed.value}
            }
            else if (filed.name == "Soft deadline"){
              // console.log("Soft deadline")
              deadline.softDeadline = {index: index, value: filed.value}
            }
            else if (filed.name == "Hard deadline"){
              // console.log("HardDeadline")
              deadline.hardDeadline = {index: index, value: filed.value}
            }
            else if (filed.name == "Этапы внедрения"){
              // console.log("HardDeadline")
              deadline.stage = {index: index, value: filed.value}
            }
            index += 1
          })
          // Checkout original estimation
          if (deadline.interval.value){
            console.log("\nIssue: "+ mapIssue.summary)
            // console.log(fileds)
            // console.log(deadline)
            const result = duration(deadline.interval.value.id as string, deadline.startDate.value as number, 0.75)
            // Checkout hard deadline
            if (result.newHardDeadlineValue != deadline.hardDeadline.value){
              const hardDeadline = fileds[deadline.hardDeadline.index]
              hardDeadline.value = result.newHardDeadlineValue as IssueCustomFieldValue
              console.log("\nUpdate HardDeadline: ")
              console.log("Old HardDeadline: " + new Date(deadline.hardDeadline.value as number))
              console.log("New HardDeadline: " + new Date(result.newHardDeadlineValue))
              // fileds[deadline.hardDeadline.index] = hardDeadline

              this.youtrack.issues.update({id: issue.id, fields: [hardDeadline]})
            } 
            // Checkout soft deadline
            if (deadline.softDeadline.value){
              if ((deadline.startDate.value as number) > deadline.softDeadline.value || result.newSoftDeadlineValue < deadline.softDeadline.value){
                console.log("\nUpdate SoftDeadline: ")
                console.log("HardDeadline: " + new Date(result.newHardDeadlineValue))
                console.log("Old SoftDeadline: " + new Date(deadline.softDeadline.value as number))
                console.log("New SoftDeadline: " + new Date(result.newSoftDeadlineValue))
                
                const softDeadline = fileds[deadline.softDeadline.index]
                softDeadline.value = result.newSoftDeadlineValue as IssueCustomFieldValue
                this.youtrack.issues.update({id: issue.id, fields: [softDeadline]})
              }
            }
            else {
              console.log("\nUpdate SoftDeadline: ")
              console.log("HardDeadline: " + new Date(result.newHardDeadlineValue))
              console.log("New SoftDeadline: " + new Date(result.newSoftDeadlineValue))
              const softDeadline = fileds[deadline.softDeadline.index]
              softDeadline.value = result.newSoftDeadlineValue as IssueCustomFieldValue
              this.youtrack.issues.update({id: issue.id, fields: [softDeadline]})
            }
            // Checkout stage
            let stage = fileds[deadline.stage.index]
            // console.log(new Date(2022, 6, 31).getTime(), new Date(2022, 6, 31))
            // if < jule
            if (result.newHardDeadlineValue < new Date(2022, 6, 31).getTime()){
              stage.value = {
                localizedName: null,
                color: {
                  foreground: '#fff',
                  background: '#8e1600',
                  id: '8',
                },
                name: 'pre-prototype',
                id: '92-93',
              }
            }
            // if < august
            else if (result.newHardDeadlineValue < new Date(2022, 7, 31).getTime()){
              stage.value = {
                localizedName: null,
                color: {
                  foreground: '#fff',
                  background: '#e30000',
                  id: '20'
                },
                name: 'prototype',
                id: '92-83',
              }
            }
            if (stage.value.name != deadline.stage.value.name){
              console.log("HardDeadline: " + new Date(result.newHardDeadlineValue))
              console.log("Stage: " + stage.value.name)
              this.youtrack.issues.update({id: issue.id, fields: [stage]})
            }
          }
        })
      })
    });
    return 'Hello World!';
  }
}

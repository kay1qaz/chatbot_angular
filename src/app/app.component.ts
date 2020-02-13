import {Component, OnInit,} from '@angular/core';
import * as AWS from 'aws-sdk';

export interface Messages {
  Owner:string;
  Message:string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'chatbot';

  chatMessages: Array<Messages> = [{
    Owner: 'ChatBot',
    Message: 'Hello, how can I help you?'}];

  sessionAttributes = {};
  lexRuntime: AWS.LexRuntime;
  lexUserId = 'userID' + Date.now(); // Client application userID
  ChatInput = '';

  ngOnInit() {
    AWS.config.region = 'us-east-1'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: ''//your Identity poolId
    });
    this.lexRuntime = new AWS.LexRuntime();
  }

  public pushChat(data1: any) {

    if (data1.chatInput !== '') {
      this.chatMessages.push({Owner: 'User', Message: data1.chatInput});
      this.ChatInput = '';
      const params = {
        botAlias: '$LATEST', //
        botName: '', // your chatbot name
        userId: this.lexUserId,
        inputText: data1.chatInput,
        sessionAttributes: this.sessionAttributes
      };
      this.lexRuntime.postText(params, (err, data) => {
        if (err) {
          console.log(err, err.stack);
        }
        if (data) {
          this.sessionAttributes = data.sessionAttributes;
          this.chatMessages.push({Owner: 'Chatbot', Message: data.message});
        }
      });
    }
  }

}

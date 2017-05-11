# Gmail Scheduler

- Forked from [webdigi/GmailScheduler](https://github.com/webdigi/GmailScheduler)
- See Webdigi's [**intro video**](http://youtu.be/4kfpQVZjFd8)

## Getting Started

- Open [Gmail Scheduler](https://script.google.com/macros/s/AKfycbw6hnnKGeG6xUsbRE9c3WSvJibTbaW88DP9f83e8lFnc1v1kL0/exec)
- Accept permissions
- Create labels as required.
  + Example: "2 hours later", "two days later" and so on. 

## Usage

#### Outgoing messages

- Compose a new message in Gmail
- Add the label under timer as required.
- **Note**: Do not click on the send button. Only set the label and leave the message in drafts.

#### Returning messages to inbox

- You can allow Gmail to return messages back to inbox.
- Apply a label under timer to any of our message, and it will return to your inbox as scheduled.

#### Accessing your GmailScheduler settings:

- Access your settings via [script.google.com/macros/s/AKfycbw6hnnKGeG6xUsbRE9c3WSvJibTbaW88DP9f83e8lFnc1v1kL0/exec](https://goo.gl/JcEdCS)

## Troubleshooting

##### 1) Cannot connect to Gmail

- You may see an error similar to the one shown in [this image](http://i.imgur.com/CNZAWhI.png)
  + This means that Gmail could not connect to Google app scripts. 
  + This timeout happens between Google services -- you can ignore these messages. 
  + Any queued messages will be sent out in the next run.
- Set a Gmail filter to delete these messages. 
  + You can filter on messages with subject "Summary of failures for Google Apps Script: Gmail Scheduler" sent from:  apps-scripts-notifications@google.com

##### 2) Uninstalling Gmail Scheduler

- Visit the https://script.google.com/macros/s/AKfycbw6hnnKGeG6xUsbRE9c3WSvJibTbaW88DP9f83e8lFnc1v1kL0/manage/uninstall
- Click on Uninstall (You can always follow the initial setup again to reinstall the scheduler)

##### 3) Error: Service using too much computer time for one day

- Uninstall and install app again to use lesser resources on Gmail.

### License

- This fork is licensed under the [MIT license](https://github.com/sbolel/GmailScheduler/blob/master/LICENSE))
- The original source of [GmailScheduler](https://github.com/webdigi/GmailScheduler) (maintained by [Webdigi](https://www.webdigi.co.uk) in London, UK) is licensed under the [MIT license](https://github.com/webdigi/GmailScheduler/blob/master/LICENSE.txt)

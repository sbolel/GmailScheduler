var SCHEDULER_EXTRAS_LABEL = 'Extras'
var SCHEDULER_LABEL = 'GScheduler'
var SCHEDULER_QUEUE_LABEL = 'Queue'
var SCHEDULER_SMS_LABEL = 'Sms'
var SCHEDULER_TIMER_LABEL = 'Timer'

var DEFAULT_PREFS = {
  // NOTE these names must match the 'name' attribute in HTML
  localzone:  'default',
  mark_sent_messages_inbox_unread: false,
  move_sent_messages_inbox: true,
  nolabel_drafs_to_inbox: false,
  send_message_sms: false,
  timer: [
    '1 hour later',
    '3 hours later',
    'One day later',
    'tomorrow 9am',
    'next monday 9am'
  ]
}

var DEFAULT_TIMEZONE = 'default'
var EMAIL_WELCOME_SUBJECT = 'Welcome to GmailScheduler'
var EXECUTE_COMMAND_LOGGING = false
var NUM_RETRIES = 10
var SETTINGS_URL = 'https://script.google.com/macros/s/AKfycbymnW7p3k9vI8UwQ4f7a7HOEEqqkjHkEncTGQucbsY/exec'
var USER_PREFS = null

function createTriggers() {
  // Refer to troubleshooting #1 to see how to remove any error messages
  deleteTriggers()
  const timerTrigger = ScriptApp.newTrigger('processTimer')
    .timeBased()
    .everyMinutes(1)
    .create()
  const queueTrigger = ScriptApp.newTrigger('processQueue')
    .timeBased()
    .everyMinutes(1)
    .create()
  const draftsTrigger = ScriptApp.newTrigger('moveDraftsToInbox')
    .timeBased()
    .everyMinutes(1)
    .create()
  /// @todo: commented out sms trigger with user reported issues of gmail limits #31
  // const smsTrigger = ScriptApp.newTrigger("processSms")
  //  .timeBased()
  //  .everyMinutes(1)
  //  .create()
}

function deleteTriggers() {
  const allTriggers = ScriptApp.getProjectTriggers()
  for (var i = 0; i < allTriggers.length; i++) ScriptApp.deleteTrigger(allTriggers[i])
}

function processTimer() {
  debug('processTimer Activated ' + new Date().toString())
  const queueLabel = SCHEDULER_LABEL + '/' + SCHEDULER_QUEUE_LABEL
  const queueLabelObject = serviceGetUserLabelByName(queueLabel)
  const timerChildLabels = getUserChildLabels(SCHEDULER_LABEL + '/' + SCHEDULER_TIMER_LABEL)
  for (var i = 0; i < timerChildLabels.length; i++) {
    const date = parseDate(timerChildLabels[i])
    var page, timerChildLabelObject
    if (date == null) continue
    const queueChildLabel = SCHEDULER_LABEL + '/' + SCHEDULER_QUEUE_LABEL + '/' + date.full()
    timerChildLabelObject = serviceGetUserLabelByName(SCHEDULER_LABEL + '/' + SCHEDULER_TIMER_LABEL + '/' + timerChildLabels[i])
    page = null
    // Get threads in "pages" of 100 at a time
    while (!page || page.length == 100) {
      page = timerChildLabelObject.getThreads(0, 100)
      if (page.length > 0) {
        createLabel(queueChildLabel)
        queueChildLabelObject = serviceGetUserLabelByName(queueChildLabel)
        if (queueChildLabelObject) {
          queueLabelObject.addToThreads(page)
          // Move the threads into queueChildLabel
          queueChildLabelObject.addToThreads(page)
        }
        // Move the threads out of timerLabel
        timerChildLabelObject.removeFromThreads(page)
      }
    }
  }
}

function processQueue() {
  debug('processQueue Activated ' + new Date().toString())
  const userPrefs = getUserPrefs(false)
  const queueLabel = SCHEDULER_LABEL + '/' + SCHEDULER_QUEUE_LABEL
  const queueLabelObject = serviceGetUserLabelByName(queueLabel)
  const queueChildLabels = getUserChildLabels(SCHEDULER_LABEL + '/' + SCHEDULER_QUEUE_LABEL)
  for (var i = 0; i < queueChildLabels.length; i++) {
    // skip if queuedatetime is not ready to process
    if (convertToUserDate(new Date()).getTime() < parseDate(queueChildLabels[i]).getTime()) {
      debug('process later')
      continue
    }
    const queueChildLabel = SCHEDULER_LABEL + '/' + SCHEDULER_QUEUE_LABEL + '/' + queueChildLabels[i]
    const queueChildLabelObject = serviceGetUserLabelByName(queueChildLabel)
    const threads = queueChildLabelObject.getThreads()
    //Remove queue child label if nothing to process
    if (threads.length === 0) deleteLabel(queueChildLabel)
    for (var x in threads) {
      const thread = threads[x]
      const message = GmailApp.getMessageById(threads[x].getMessages()[0].getId())
      if (message.isDraft()) {
        dispatchDraft(threads[x].getMessages()[0].getId())
        //move sent message to inbox
        if (userPrefs['move_sent_messages_inbox']) {
          const sentMessage = GmailApp.search('To:' + message.getTo() + ' label:sent subject:' + message.getSubject() + '')[0]
          sentMessage.removeLabel(queueLabelObject)
          sentMessage.removeLabel(queueChildLabelObject)
          sentMessage.moveToInbox()
        }
      } else {
        thread.removeLabel(queueLabelObject)
        thread.removeLabel(queueChildLabelObject)
        GmailApp.moveThreadToInbox(threads[x])
        if (userPrefs['mark_sent_messages_inbox_unread']) GmailApp.markMessageUnread(message)
      }
    }
  }
}

function moveDraftsToInbox() {
  const userPrefs = getUserPrefs(false)
  if (!userPrefs['nolabel_drafs_to_inbox']) return
  const drafts = GmailApp.getDraftMessages()
  for (var i = 0; i < drafts.length; i++) {
    if (drafts[i].getSubject().match(/inbox0/)) {
      //BONUS: If draft emails have subject inbox0 in them, then do not return those to inbox.
    } else {
      //Move to these drafts to inbox
      drafts[i].getThread().moveToInbox()
    }
  }
}

function processSms() {
  const userPrefs = getUserPrefs(false)
  if (!userPrefs['send_message_sms']) return
  const smsLabel = SCHEDULER_LABEL + '/' + SCHEDULER_EXTRAS_LABEL + '/' + SCHEDULER_SMS_LABEL
  const smsLabelObject = serviceGetUserLabelByName(smsLabel)
  const smsLabelThreads = smsLabelObject.getThreads()
  const now = new Date().getTime()
  for (i in smsLabelThreads) {
    CalendarApp.createEvent('IMP- ' + smsLabelThreads[0].getFirstMessageSubject(), new Date(now + 60000), new Date(now + 60000))
    CalendarApp.createEvent('IMP- ' + smsLabelThreads[0].getFirstMessageSubject(), new Date(now + 60000), new Date(now + 60000)).addSmsReminder(0)
  }
  smsLabelObject.removeFromThreads(smsLabelThreads)
}

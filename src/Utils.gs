Sugar.Date.extend()

function getTimeZoneString() {
  const userPrefs = getUserPrefs()
  var timezone_string = userPrefs['localzone']
  debug('User timezone:' + timezone_string)
  if (timezone_string == DEFAULT_TIMEZONE) {
    timezone_string = CalendarApp.getDefaultCalendar().getTimeZone()
    debug('Loading timezone from calendar: ' + timezone_string)
  }
  return timezone_string
}

function convertToUserDate(date) {
  const user_timezone_string = getTimeZoneString()
  const user_date_string = Utilities.formatDate(date, user_timezone_string, 'yyyy/MM/dd HH:mm:ss')
  const user_date = new Date(user_date_string)
  debug('Converted:' + date + ' to user time:' + user_date)
  return user_date
}

function getActiveUser() {
  return Session.getActiveUser()
}

function getActiveUserEmail() {
  return getActiveUser().getEmail()
}

function userHasLabel(label) {
  const labels = serviceGetUserLabels()
  for (var i = 0; i < labels.length; i++) {
    debug('label: ' + labels[i].getName())
    if (labels[i].getName() == label) return true
  }
  return false
}

function createLabel(label) {
  label = serviceCreateLabel(label)
  if (label) {
    debug('New label created successfully')
    return true
  } else {
    //receipts.push(' Error trying to create a new label: "' + label + '". Cannot continue.  :-(')
    debug('Error creating label!')
    return false
  }
}

function deleteLabel(label) {
  label = serviceDeleteLabel(label)
  if (label) {
    debug('label deleted successfully')
    return true
  } else {
    debug('Error deleting label!')
    return false
  }
}

function createTimerChildLabels(labels) {
  for (var i in labels)
    createLabel(SCHEDULER_LABEL + '/' + SCHEDULER_TIMER_LABEL + '/' + labels[i])
  return true
}

function createTimerChildLabel(label) {
  createLabel(SCHEDULER_LABEL + '/' + SCHEDULER_TIMER_LABEL + '/' + label)
}

function deleteTimerChildLabel(label) {
  deleteLabel(SCHEDULER_LABEL + '/' + SCHEDULER_TIMER_LABEL + '/' + label)
}

function getUserChildLabels(label) {
  labels = serviceGetUserLabels()
  const childLabels = []
  for (var i = 0; i < labels.length; i++)
    if (labels[i].getName().indexOf(label + '/') == 0)
      childLabels.push(labels[i].getName().replace(label + '/', ''))
  return childLabels
}

function parseDate(str) {
  if (dateConversionRequired(str)) return convertToUserDate(Date.create(str))
  return Date.create(str)
}

function parseDateFormat(str) {
  var date = Date.create(str)
  if (date.isValid() && date.isFuture()) return convertToUserDate(date).full()
  return null
}

function debug(msg) {
  Logger.log(msg)
}

function dateConversionRequired(str) {
  const subs = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second']
  for (var i = 0; i != subs.length; i++) if (str.indexOf(subs[i]) !== -1) return true
  return false
}

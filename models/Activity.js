// models/Activity.js
class Activity {
  constructor(title, description, date, location, maxParticipants) {
    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.date = date;
    this.location = location;
    this.maxParticipants = maxParticipants;
    this.participants = [];
  }
}

module.exports = Activity;
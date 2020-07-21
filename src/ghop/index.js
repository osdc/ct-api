const GithubAPI = require("./gitcommitpr");
const editMarkdown = require("./editmarkdown");
const addSlides = require("./editmarkdown");

async function ghop(meetupData, token) {
  let readmecontent = await editMarkdown(meetupData);
  console.log("Markdown fetched and edited");
  let api = new GithubAPI({
    token: token
  });
  api.setRepo("daemon1024", "meetups");
  console.log("repo set to daemon1024/meetups");
  api
    .setBranch("meetup-api")
    .then(() => {
      console.log("pushing files");
      api.pushFiles("Add new meetup on " + meetupData.date, [
        { content: readmecontent, path: "README.md" }
      ]);
    })
    .then(function() {
      console.log("Files committed!");
    })
    .then(() => {
      api
        .createpr({
          title: "added new meetup via api",
          body: "Please pull these in!",
          head: "meetup-api",
          base: "master"
        })
        .then(() => console.log("made a pr"));
    });
}

async function ghopslides(slides, token) {
  let readmecontent = await addSlides(slides);
  console.log("Markdown fetched and updated with resources");
  let api = new GithubAPI({
    token: token
  });
  api.setRepo("daemon1024", "meetups");
  console.log("repo set to daemon1024/meetups");
  api
    .setBranch("meetup-api")
    .then(() => {
      console.log("pushing files");
      api.pushFiles("Adding resources for latest meetup", [
        { content: readmecontent, path: "README.md" }
      ]);
    })
    .then(function() {
      console.log("Files committed!");
    })
    .then(() => {
      api
        .createpr({
          title: "added resources to latest meetup via api",
          body: "Please pull these in!",
          head: "meetup-api",
          base: "master"
        })
        .then(() => console.log("made a pr"));
    });
}

module.exports = ghop;
module.exports = ghopslides;

// let meetupData = {
//   date: "2020-01-01",
//   topic: "Dk",
//   details: "Doesn't matter",
//   speaker: "someone on earth"
// };

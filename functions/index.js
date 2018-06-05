const axios = require('axios')
const FormData = require('form-data')
const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

function verifyFurukawa(body) {
  return body.user_id === 'U4V8BMLKG'
}

exports.checkinCommand = functions.https.onRequest((request, response) => {
  const verified = verifyFurukawa(request.body)

  if (!verified) {
    return response.send({
      "text": "古河でない",
      "response_type": "in_channel"
    })
  }

  return checkin().then(() => {
    return response.send({
      "text": "おはようございます :sunny:",
      "response_type": "in_channel"
    })
  }).catch((error) => {
    console.log(error)

    return response.send({
      "text": "エラーが発生しました：" + error.message,
      "response_type": "in_channel"
    })
  })
})

function checkin() {
  const profile = {
    "status_text": "出勤してます",
    "status_emoji": ":mostly_sunny:"
  }

  const form = new FormData()

  form.append('token', functions.config().slack.token)
  form.append('profile', JSON.stringify(profile))

  return axios.post(
    'https://slack.com/api/users.profile.set',
    form,
    { headers: form.getHeaders() }
  ).then(response => {
    if (response.data.ok === false) {
      console.log(response.data)
      throw new Error('Unauthorized')
    }
  })
}

exports.checkoutCommand = functions.https.onRequest((request, response) => {
  const verified = verifyFurukawa(request.body)

  if (!verified) {
    return response.send({
      "text": "古河でない",
      "response_type": "in_channel"
    })
  }

  return checkout().then(() => {
    return response.send({
      "text": "おつかれさまでした :clap:",
      "response_type": "in_channel"
    })
  }).catch((error) => {
    console.log(error)

    return response.send({
      "text": "エラーが発生しました：" + error.message,
      "response_type": "in_channel"
    })
  })
})


function checkout() {
  const profile = {
    "status_text": "退勤しました",
    "status_emoji": ":house_with_garden:"
  }

  const form = new FormData()

  form.append('token', functions.config().slack.token)
  form.append('profile', JSON.stringify(profile))


  return axios.post(
    'https://slack.com/api/users.profile.set',
    form,
    { headers: form.getHeaders() }
  ).then(response => {
    if (response.data.ok === false) {
      console.log(response.data)
      throw new Error('Unauthorized')
    }
  })
}
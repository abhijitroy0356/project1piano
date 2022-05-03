//const e = require("express")

//const song = require("../models/song")

const white_bars=['1','2','3','4','5','6','7','8','9','0','z']
const black_bars=['q','w','e','r','t','y','u','i','o','p','a','x','n']

const recordButton = document.querySelector('.record-button')
const playButton = document.querySelector('.play-button')
const saveButton = document.querySelector('.save-button')
const songLink = document.querySelector('.song-link')
const clicked=document.querySelectorAll('.key')
const whiteBars=document.querySelectorAll('.key.white')
const blackBars=document.querySelectorAll('.key.black')

const keyMap = [...clicked].reduce((map, key) => {
    map[key.dataset.note]=key
    return map
},{}) 

let recordingStartTime
let songNotes

clicked.forEach(key => {
  key.addEventListener('click', () => playNote(key))
})

recordButton.addEventListener('click',toggleRecording)
saveButton.addEventListener('click',saveSong)
playButton.addEventListener('click',playSong)

document.addEventListener('keydown', press => {
  const key=press.key
  const whiteKeyIndex=white_bars.indexOf(key)
  const blackKeyIndex=black_bars.indexOf(key)
  if (whiteKeyIndex>-1)
   playNote(whiteBars[whiteKeyIndex])
  if (blackKeyIndex>-1)
   playNote(blackBars[blackKeyIndex])
})

function toggleRecording(){
  recordButton.classList.toggle('active')
  if(isRecording()){
    startRecording()
  }else{
    stopRecording()
  }
}

function isRecording(){
  return recordButton!=null && recordButton.classList.contains('active')
}

function startRecording(){
  recordingStartTime = Date.now()
  songNotes = []
  playButton.classList.remove('show')
  saveButton.classList.remove('show')
}

function stopRecording(){
  playSong()
  playButton.classList.add('show')
  saveButton.classList.add('show')
}

function playSong(){
  if(songNotes.length === 0)return
  songNotes.forEach(note=>{
    setTimeout(()=>{
      playNote(keyMap[note.key])
    },note.startTime)
  })
}

function playNote(key) {
  if(isRecording())recordNote(key.dataset.note)
  const noteAudio=document.getElementById(key.dataset.note)
  noteAudio.currentTime = 0
  noteAudio.play()
  key.classList.add('active')
  noteAudio.addEventListener('ended', () => {
    key.classList.remove('active')
  })
}

function recordNote(note){
  songNotes.push({
    key: note,
    startTime: Date.now() - recordingStartTime
  })
}

function saveSong(){
  axios.post('/songs',{songNotes:songNotes}).then(res=>{
    songLink.classList.add('show')
    songLink.href=`/songs/${res.data._id}`
  })
  
}
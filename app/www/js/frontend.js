/**
 * TestScreenRecording - frontend.js
 * Author: Milos Petrasinovic <mpetrasinovic@pr-dc.com>
 * PR-DC, Republic of Serbia
 * info@pr-dc.com
 * 
 * --------------------
 * Copyright (C) 2022 PR-DC <info@pr-dc.com>
 *
 * This file is part of TestScreenRecording.
 *
 * TestScreenRecording is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as 
 * published by the Free Software Foundation, either version 3 of the 
 * License, or (at your option) any later version.
 * 
 * TestScreenRecording is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with TestScreenRecording.  If not, see <https://www.gnu.org/licenses/>.
 *
 */
 
// Global variables
var device_platform;
var recording = 0;
var detect_android_notch_dt = 100;

// DOM elements
var loader_animation = document.getElementById('loading');

// Event listeners
document.addEventListener('deviceready', onDeviceReady, false);

// onDeviceReady() function
// Device is ready
// --------------------
function onDeviceReady() {
  console.log('Running cordova-' + cordova.platformId +
    '@' + cordova.version);
  device_platform = cordova.platformId;
  document.body.classList.add(device_platform);
  document.addEventListener('resume', onResume, false);

  // Keep awake
  keepAwake();
  
  if(device_platform == 'android') {
    // Status bar color
    changeAndroidStatusBarColor();
    
    // Detect notch
    detectAndroidNotch();
    window.addEventListener('resize', detectAndroidNotch, false);
    screen.orientation.addEventListener('change', function() {
      setTimeout(detectAndroidNotch, detect_android_notch_dt);
    });
    
    // Screen recording
    toggleRecording = document.getElementById('toggle-recording');
    
    toggleRecording.onclick = function() {
      recording = !recording;
      if(recording) {
        var d = new Date();
        ScreenRecord.startRecord({
            recordAudio: false,
            bitRate: 6000000,
            title: 'TestScreenRecording',
            text: 'Screen recording active...'
          }, 
          'TSR_' + ('0' + d.getDate()).slice(-2)
            + ('0' + (d.getMonth() + 1)).slice(-2)
            + d.getFullYear()+ '_' + ('0' + d.getHours()).slice(-2)
            + ('0' + d.getMinutes()).slice(-2)
            + ('0' +d.getSeconds()).slice(-2) + '.mp4', 
          function(data) {
            // Success
            console.log(data);
          }, function(data) {
            // Error 
            console.log(data);
        });
        toggleRecording.innerText = 'Stop Recording'; 
        toggleRecording.classList.add('recording');
      } else {
       ScreenRecord.stopRecord(function(data) {
          // Success
          console.log(data);
        }, function(data) {
          // Error 
          console.log(data);
        });
        toggleRecording.innerText = 'Start Recording'; 
        toggleRecording.classList.remove('recording');
      }
    };
  }
}

// changeAndroidStatusBarColor() function
// Change statusbar color on android
// --------------------
function changeAndroidStatusBarColor() {
  var initial_height = document.documentElement.clientHeight;
  window.addEventListener('resize', resizeFunction);
  function resizeFunction() {
    status_bar_height = 
      document.documentElement.clientHeight - initial_height;
    detectAndroidNotch();
    window.removeEventListener('resize', resizeFunction);
  }
  StatusBar.overlaysWebView(true);
  StatusBar.styleDefault();
}
  
// detectAndroidNotch() function
// Detect notch on android
// --------------------
function detectAndroidNotch() {
  const style = document.documentElement.style;
  window.AndroidNotch.getInsetTop(px => {
    if(px) {
      style.setProperty('--notch-inset-top', (px+5) + 'px');
    } else {
      style.setProperty('--notch-inset-top', '24px');
    }
  }, (err) => console.error('Failed to get insets top:', err));
  window.AndroidNotch.getInsetRight(px => {
    if(px) {
      style.setProperty('--notch-inset-right', (px+5) + 'px');
    } else {
      style.setProperty('--notch-inset-right', '0px');
    }
  }, (err) => console.error('Failed to get insets right:', err));
  window.AndroidNotch.getInsetBottom(px => {
    if(px) {
      style.setProperty('--notch-inset-bottom', (px+5) + 'px');
    } else {
      style.setProperty('--notch-inset-bottom', '0px');
    }
  }, (err) => console.error('Failed to get insets bottom:', err));
  window.AndroidNotch.getInsetLeft(px => {
    if(px) {
      style.setProperty('--notch-inset-left', (px+5) + 'px');
    } else {
      style.setProperty('--notch-inset-left', '0px');
    }
  }, (err) => console.error('Failed to get insets left:', err));
}

// keepAwake() function
// Keep device awake
// --------------------
function keepAwake() {
  window.plugins.insomnia.keepAwake();
}

// onResume() function
// On resume
// --------------------
function onResume() {
  keepAwake();
}

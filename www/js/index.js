/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        // Add 3 listeners. Android is going to call the most specific listener for a tag.

        // NFC tags with NDEF messages
        nfc.addNdefListener (
            function (nfcEvent) {

                var tag = nfcEvent.tag;
                var ndefMessage = tag.ndefMessage;

                // message might have mulitple records
                // we're just looking at the first one
                var ndefRecord = tag.ndefMessage[0];

                // attempt to decode the record payload
                var payload;

                if (util.isType(ndefRecord, ndef.TNF_WELL_KNOWN, ndef.RTD_URI)) {

                    payload = ndef.uriHelper.decodePayload(ndefRecord.payload);

                } else if (util.isType(ndefRecord, ndef.TNF_WELL_KNOWN, ndef.RTD_TEXT)) {

                    payload = ndef.textHelper.decodePayload(ndefRecord.payload);

                } else {

                    // some other type (you need to write code to decode)
                    payload = JSON.stringify(ndefMessage);

                }

                navigator.notification.alert(payload, null, 'Found NDEF tag');
            },
            function () { // success callback
                window.plugins.toast.showShortCenter('Listening for NDEF tags');
            },
            function (error) { // error callback
                alert("Error adding NDEF listener " + JSON.stringify(error));
            }
        );

        // NFC tags that can be formatted as NDEF
        nfc.addNdefFormatableListener (
            function (nfcEvent) {
                window.plugins.toast.showLongTop('This NFC tag can be formatted as NDEF');

                // create a new NDEF message and write it to the tag
                var message = [
                    ndef.uriRecord('http://github.com/don')
                ]
                nfc.write(
                    message, 
                    function() {
                        navigator.notification.alert('Wrote new message to NFC tag', null, 'Success');
                    },
                    function() {
                        navigator.notification.alert('Failed to write message to NFC tag', null, 'Error');
                    }
                );

            },
            function () { // success callback
                console.log('Also listening for tags that are NDEF formatable tags');
            },
            function (error) { // error callback
                alert('Error adding NDEF listener ' + JSON.stringify(error));
            }
        );

        // Some tags are neither NDEF or Formattable. Some devices (like Nexus 4 and Samsung S4) 
        // can't read NDEF messages from Mifare Classic tag but can still get the tag id
        nfc.addTagDiscoveredListener (
            function (nfcEvent) {
                var tag = nfcEvent.tag;
                navigator.notification.alert(JSON.stringify(tag), null, 'Found non-NDEF NFC tag');
            },
            function () { // success callback
                console.log('Also listening for non-NDEF tags');
            },
            function (error) { // error callback
                alert('Error adding NDEF listener ' + JSON.stringify(error));
            }
        );

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
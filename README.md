Test project to see if [phonegap-nfc](https://github.com/chariotsolutions/phonegap-nfc) works with NfcV tags on Android. Note that this code isn't NfcV specific it will also work with any NDEF tags.

The app will read NDEF tags and display payload of the first NDEF record.

If the app reads an NFC Tag that *can be formatted as NDEF*, it will format the tag and write an NDEF message containing a URI record.

Tested with Cordova 6.3.1 on a Nexus 5X running Android 7.0 and NXP ICODE SLIX SL2S2002 tags. 

Build and run 

    $ git clone https://github.com/don/nfc-test
    $ cd nfc-test
    $ cordova platform add android
    $ cordova run android --device

Use NXP Tag Writer to erase NFcV tags and remove NDEF infomation.
  Erase Tags -> Format Tags -> Factory Default

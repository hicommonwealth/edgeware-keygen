import 'normalize.css';
import 'styles.css';

import * as $ from 'jquery';
import { mnemonicGenerate, mnemonicValidate } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';
import Keyring from '@polkadot/keyring';


$('.generate-keypair').click((e) => {
  const phrase = mnemonicGenerate();
  const keyring = new Keyring({ type: 'sr25519' });
  const keyringPair = keyring.addFromMnemonic(phrase);

  $('.generated-account').show();
  $('.generated-phrase').text(phrase);
  $('.generated-publickey').text('' + u8aToHex(keyringPair.publicKey()));
  $('.generated-testnet-ss58').text(keyringPair.address());
  $('.generated-edgeware-ss58').text(keyringPair.address());
});

$('.ss58-convert').click((e) => {
  let publickey;
  const address = '' + $('.ss58-address').val();
  const keyring = new Keyring();
  try {
    keyring.addFromAddress(address);
    publickey = '' + u8aToHex(keyring.getPublicKeys()[0]);
  } catch (e) {
    alert('Invalid address!');
    return;
  }

  $('.converted-account').show();
  $('.converted-address').text(address);
  $('.converted-publickey').text(publickey);
});

import 'normalize.css';
import 'styles.css';

import * as $ from 'jquery';
import { mnemonicGenerate, mnemonicValidate } from '@polkadot/util-crypto';
import { u8aToHex, hexToU8a, stringToU8a, u8aConcat } from '@polkadot/util';
import { blake2AsU8a } from '@polkadot/util-crypto/blake2';
import Keyring, { encodeAddress } from '@polkadot/keyring';
import createPair from '@polkadot/keyring/pair';


$('.evm-convert').click((e) => {
  const evmAddress = '' + $('.evm-address').val();

  try {
    const addr = hexToU8a(evmAddress);
    const data = stringToU8a('evm:');
    const res = blake2AsU8a(u8aConcat(data, addr));

    const mainnetKeyring = new Keyring({ type: 'sr25519', ss58Format: 7 });
    const mainnetPair = createPair({ toSS58: mainnetKeyring.encodeAddress, type: 'sr25519' }, { publicKey: res });
    const convertedMainnetAddress = mainnetPair.address;

    $('.evm-converted').show();
    $('.evm-converted-address').text('' + convertedMainnetAddress);
  } catch (e) {
    alert('Invalid address!');
    return;
  }
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

$('.pk-convert').click((e) => {
  let testnetAddress;
  let mainnetAddress;
  const publickey = '' + $('.pk-publickey').val();
  try {
    const testnetKeyring = new Keyring({ type: 'sr25519' });
    const testnetPair = createPair({ toSS58: testnetKeyring.encodeAddress, type: 'sr25519' }, { publicKey: hexToU8a(publickey) });
    testnetAddress = testnetPair.address;
    const mainnetKeyring = new Keyring({ type: 'sr25519', ss58Format: 7 });
    const mainnetPair = createPair({ toSS58: mainnetKeyring.encodeAddress, type: 'sr25519' }, { publicKey: hexToU8a(publickey) });
    mainnetAddress = mainnetPair.address;
  } catch (e) {
    alert('Invalid public key!');
    return;
  }
  $('.pk-converted-account').show();
  $('.pk-converted-publickey').text(publickey);
  $('.pk-converted-testnet-address').text(testnetAddress);
  $('.pk-converted-mainnet-address').text(mainnetAddress);
});

$('.generate-keypair').click((e) => {
  const phrase = mnemonicGenerate();
  const testnetKeyring = new Keyring({ type: 'sr25519' });
  const testnetKeyringPair = testnetKeyring.addFromMnemonic(phrase);
  const mainnetKeyring = new Keyring({ type: 'sr25519', ss58Format: 7 });
  const mainnetKeyringPair = mainnetKeyring.addFromMnemonic(phrase);

  $('.generated-account').show();
  $('.generated-phrase').text(phrase);
  $('.generated-publickey').text('' + u8aToHex(testnetKeyringPair.publicKey));
  $('.generated-testnet-ss58').text(testnetKeyringPair.address);
  $('.generated-mainnet-ss58').text(mainnetKeyringPair.address);
});

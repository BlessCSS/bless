import yargs from 'yargs';
import { version } from '../../package.json';

export default function appendCommon() {
  yargs.usage(`BlessCSS v${version}`.magenta + ` - Tools to ensure CSS files meet IE 6-9 selector limit restrictions.`)
    .epilogue('For additional information see http://blesscss.com')
    .wrap(null);
}

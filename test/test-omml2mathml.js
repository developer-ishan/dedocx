import fs from 'fs';
import path from 'path';
import assert from 'assert';
import xmldom from 'xmldom';
import omml2mathml from '../src/lib/omml2mathml';

describe('omml2mathml conversion', function() {
  this.timeout(20 * 1000);
  it('converts all the test documents', () => {
    let baseDir = path.join(__dirname, 'fixtures/omml2mathml'),
      name = [],
      omml = [],
      html = [];
    fs.readdirSync(baseDir).forEach(f => {
      let abs = path.join(baseDir, f);
      if (/\.omml$/.test(f)) {
        omml.push(fs.readFileSync(abs, 'utf8'));
        name.push(f);
      }
      if (/\.html$/.test(f))
        html.push(fs.readFileSync(abs, 'utf8').replace(/ xmlns=".*?"/, ''));
    });
    omml.forEach((om, idx) => {
      let n = name[idx],
        doc = new xmldom.DOMParser().parseFromString(om),
        math = omml2mathml(doc);
      assert.equal(
        cleanup(html[idx]),
        cleanup(math.outerHTML),
        `successful mapping of ${n}`
      );
    });
  });
});

function cleanup(str) {
  return (str || '').replace(/^\s+$/gm, '').replace(/\s+$/gm, '');
}

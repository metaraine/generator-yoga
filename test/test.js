const helpers = require('yeoman-test')
const path = require('path')
const assert = require('yeoman-assert')

describe('yogini', () => {

  describe('create mode', () => {

    before(async () => {
      await helpers.run(path.join(__dirname, '../app'))
        .withPrompts({
          project: 'myproject',
          description: 'mydescription',
          username: 'metaraine',
          license: 'ISC'
        })
    })

    it('copies files', () => {
      assert.file([
        'package.json',
        'README.md',
        'app',
        'app/index.js',
        'app/yogini.json',
        'app/templates/README.md'
      ])
    })

    it('copies the package.json and populates it with the prompt values', () => {
      assert.fileContent('package.json', '"name": "myproject"')
      assert.fileContent('package.json', '"description": "mydescription"')
      assert.fileContent('package.json', '"author": "metaraine"')
      assert.fileContent('package.json', '"license": "ISC"')
    })

  })

  describe('test app', () => {

    before(async () => {
      await helpers.run(path.join(__dirname, 'testapp'))
        // these keys must be defined in yogini.json or they will be silently ignored
        .withPrompts({
          project: 'myproject',
          description: 'mydescription',
          t: true,
          f: false,
        })
    })

    it('copies files', () => {
      assert.file([
        'README.md'
      ])
    })

    it('copies and properly renames files with empty prefixnote expressions', () => {
      assert.file([
        'empty.txt'
      ])
    })

    it('templates files with ejs', () => {
      assert.fileContent('README.md', '# myproject\n\nmydescription')
    })

    it('templates files with striate', () => {
      assert.fileContent('striate.txt', 'A\nB\nC')
    })

    it('ignores folders with a false prefixnote expression', () => {
      assert.noFile([
        'folderIgnore',
        '{folderIgnore}',
        'folderIgnore/content.txt',
        '{folderIgnore}/content.txt',
        'isNotTrue.txt',
        '{!isTrue}/isNotTrue.txt',
      ])
    })

    it('includes folders with a true prefixnote expression', () => {
      assert.file([
        'folderInclude',
        'folderInclude/content.txt'
      ])
    })

    it('copies files of folders with empty names into the parent folder', () => {
      assert.file([
        'flatten.txt'
      ])
      assert.noFile([
        'flatten',
        '{flatten}'
      ])
    })

    it('copies files with quotes in expressions', () => {
      assert.file([
        'quotes.txt'
      ])
    })

  })

  it('parse', async () => {

    await helpers.run(path.join(__dirname, 'parse'))
      .withPrompts({
        foo: 'moo',
      })

    assert.fileContent('foo.txt', 'foo: moo\nbar: moobar')

  })

  it('prompts function', async () => {

    await helpers.run(path.join(__dirname, 'prompts-function'))
      .withPrompts({
        foo: 'moo',
      })

    assert.fileContent('foo.txt', 'foo: moo')

  })

})

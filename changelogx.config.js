const usersHash = {
  'Roy Riojas': 'royriojas',
};

const inferTagFromCommit = ( commit, availableTags ) => {
  const commitLowerCased = ( commit.subject || '' ).toLowerCase();
  const matchesAFix = !!commitLowerCased.match( /\bfix\b/ || commitLowerCased.match( /\bbug fix\b/ ) );
  const matchesARef = !!( commitLowerCased.match( /\bref\b/ ) || commitLowerCased.match( /\brefactor\b/ ) );

  if ( matchesAFix ) return { tagId: 'FIX', tagName: availableTags.FIX };
  if ( matchesARef ) return { tagId: 'REF', tagName: availableTags.REF };

  const { tagId, tagName } = commit;

  return { tagId, tagName };
};

module.exports = {
  changelogx: {
    ignoreRegExp: ['BLD: Release', 'DOC: Generate Changelog', 'Generated Changelog'],
    issueIDRegExp: '#(\\d+)',
    commitURL: 'https://github.com/royriojas/corona/commit/{0}',
    authorURL: 'https://github.com/royriojas/corona/{0}',
    issueIDURL: match => `https://github.com/royriojas/corona/${match}`,
    projectName: 'corona',
    processCommit: ( entry, { commitTags } ) => {
      const commit = entry.commit || {};
      entry.author = usersHash[entry.author] || entry.author;

      if ( !commit.tagId || commit.tagId === 'NC' ) {
        entry.commit = {
          ...commit,
          ...inferTagFromCommit( commit, commitTags ),
        };
      }
      return entry;
    },
  },
};

# Maintaining Bless

This document is primarily for members of the BlessCSS organization, though
publicly available for your viewing pleasure. It describes how we work as a team
to provide our downstream users with a great product. You will find descriptions
for common tasks such as triaging, merging pull requests, and release
procedures.

If you are interested in contributing to Bless, you should check out the
[Contributing Guide](./CONTRIBUTING.md).

## Triaging Issues

When new issues pop up we need to identify urgent issues (such as nobody can use
the tool, or install Bless), close and link duplicate issues, answer questions,
etc.  Please alert the [gitter/bless](https://gitter.im/BlessCSS/bless) chat
room of the urgent issues.

Some issues are opened that are just too vague to do anything about. If after
attempting to get feedback from issue authors fails after 7 days, then close the
issue. Please inform the issue author that they may re-open if they are able to
present the requested information.

## Merging a pull request

Please, make sure:

- Travis build is green
- Review the code to ensure quality is sufficient. The code should be clean and
  easy to read, tested and if public facing documented.
- At least one collaborator (other than you) approves the PR
  - Commenting "LGTM" (Looks good to me) or something of similar sorts is
    sufficient.
  - If it's a simple docs change or a typo fix, feel free to skip this step.

## Becoming a maintainer

If you are interested in becoming a Bless maintainer, start by reviewing issues
and pull requests. Answer questions for those in need of troubleshooting. Join
us in the [gitter/bless](https://gitter.im/BlessCSS/bless) chat room. Once we
see you helping, either we will reach out and ask you if you want to join or you
can ask one of the [organization
owners](https://github.com/orgs/BlessCSS/teams/owners) to add you. We will try
our best to be proactive in reaching out to those that are already helping out.

GitHub by default does not publicly state that you are a member of the
organization. Please feel free to change that setting for yourself so others
will know who's helping out. That can be configured on the [organization
list](https://github.com/orgs/BlessCSS/people) page.

Being a maintainer is not an obligation. You can help when you have time and be
less active when you don't. If you get a new job and get busy, that's alright.

## Releases

Releases should include documentation, git tag, and finally the actual npm
module publish. New versions should follow [SemVer](http://semver.org/)
versioning constraints. If it is determined that such has been violated that
release should be deprecated and patched as soon as possible.

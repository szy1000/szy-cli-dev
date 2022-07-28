'use strict';
// import * as urlJoin from "url-join";

const axios = require('axios')
const urlJoin = require('url-join')
const semver = require('semver')

function getNpmInfo(npmName, registry) {
  if(!npmName) {
    return null
  }
  const _registry = registry || getDefaultRegistry()
  const npmInfoUrl = urlJoin(_registry, npmName)
  return axios.get(npmInfoUrl).then(res => {
    if(res.status === 200) {
      return res.data
    }
    return null
  }).catch(err => {
    return Promise.reject(err)
  })
}

async function getNpmInfoVersions(npmName, registry) {
  const data = await getNpmInfo(npmName, registry)
  if(data) {
    return  Object.keys(data.versions)
  } else {
    return []
  }
}

function getSemverVersions(baseVersion, versions) {
  return versions
    .filter(version =>  semver.satisfies(version, `^${baseVersion}`))
    .sort((a, b) => semver.gt(b, a))
}

async function getNpmSemverVersion(baseVersion, npmName, registry) {
  const versions = await getNpmInfoVersions(npmName, registry);
  const newVersions = await getSemverVersions(baseVersion, versions)
  if(newVersions && newVersions.length > 0) {
    return newVersions[newVersions.length - 1]
  }
  // return newVersions
}

function getDefaultRegistry(isOriginal = false) {
  return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org'
}

module.exports = {
  getNpmInfo,
  getNpmInfoVersions,
  getNpmSemverVersion
};

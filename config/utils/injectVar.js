/**
 * 通过 DefinePlugin 往源代码中注入环境变量
 * 
 * */ 


const config = {
  dev: {

  },
  stage: {
    BASE_URL: 'https:10.0.7.12',
    SSO_BASE_URL: '',
    FILE_URL: ''
  },
  uat: {

  },
  prd: {

  }
}

function createEnvVar(config) {
  return (env) => {
    return config[env] ?? {}
  }
}


module.exports = createEnvVar(config)
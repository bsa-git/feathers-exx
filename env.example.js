// The values in the configuration files "config/env/"
// will be overwritten by the values of "env.js" file

module.exports = {
    app_env: 'development', // development, production, testing
    global: {
        debug: true,
        maintenance: false,
        ui: {
            color_theme: 'darkly', // default(Bulma as-is); cerulean(A calm blue sky); darkly(Flatly in night-mode)
        },
        api: {
            database: {
                current: 'sqlite' // 'sqlite', 'mysql', 'postgres', 'mssql'
            }
        },
        personal_data: {
            logo_img: '/images/bsa-logo/4_bsa-logo_229x75.png',
            copyright: '© 2017 BSA Lab.',
            contact: {
                website: 'http://bsa-git.github.io/'
            }
        }
    },
    development: {
        api: {
            base_url: 'http://localhost'
        }
    }
};

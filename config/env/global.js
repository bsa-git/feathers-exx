"use strict";

// Global values for application"
module.exports = {
    debug: false,
    maintenance: false,
    app: {
        appPort: 3000,
        exxPort: 3030,
        controllers: [
            {'icon':'fa-cog', 'name':'service', 'value': 'Services'},
            {'icon':'fa-key', 'name':'auth', 'value': 'Authentication'}
        ],
        actions: {
            'service': [
                {'name':'about', 'url': '/service/about', 'value': 'About'},
                {'name':'start-server', 'url': '/service/start-server', 'value': 'Getting Started on the server'},
                {'name':'start-client', 'url': '/service/start-client', 'value': 'Getting Started on the client'},
                {'name':'methods', 'url': '/service/methods', 'value': 'Methods'},
                {'name':'events', 'url': '/service/events', 'value': 'Events'},
                {'name':'hooks', 'url': '/service/hooks/ok', 'value': 'Hooks'},
                {'name':'rest-apis', 'url': '/service/rest-apis', 'value': 'REST APIs'}
            ],
            'auth': [
                {'name':'about', 'url': '/auth/about', 'value': 'About'},
                {'name':'server', 'url': '/auth/server', 'value': 'Server'},
                {'name':'client', 'url': '/auth/client', 'value': 'Client'},
                {'name':'local', 'url': '/auth/local', 'value': 'Local'},
                {'name':'jwt', 'url': '/auth/jwt', 'value': 'JWT'},
                {'name':'oauth1', 'url': '/auth/oauth1', 'value': 'OAuth1'},
                {'name':'oauth2', 'url': '/auth/oauth2', 'value': 'OAuth1'}
            ]
        }
    },
    ui: {
        color_theme: 'default', // default(Bulma as-is); cerulean(A calm blue sky); darkly(Flatly in night-mode)
    },
    personal_data: {
        app_title: 'Feathers examples',
        logo_title: 'BSA Lab.',
        logo_icon: 'fa-address-card',
        logo_img: '/images/bsa-logo/4_bsa-logo_229x75.png',
        copyright: '© 2017 BSA Lab.',
        designed_with: 'BSA Lab.',
        designed_with_url: 'http://bsa-git.github.io/',
        contact: {
            fullName: 'Sergey Beskorovainny',
            givenName: 'Sergey',
            familyName: 'Beskorovainny',
            emailPersonal: 'bsa2657@yandex.ru',
            emailWork: 'm5-asutp@azot.ck.ua',
            website: 'http://bsa-git.github.io/'
        },
        twitter: {url: 'https://twitter.com/bsa2657', tag: '@bsa2657'},
        socials: {
            facebook: {url: 'https://www.facebook.com/profile.php?id=100010324420196', icon: 'fa-facebook'},
            twitter: {url: 'https://twitter.com/bsa2657', icon: 'fa-twitter'},
            google: {url: 'https://plus.google.com/110341449488589699610?rel=author', icon: 'fa-google-plus'}
        }
    },
    pagination:{
        total: 6
    }
}

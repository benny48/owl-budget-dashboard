# -*- coding: utf-8 -*-
{
    'name' : 'Budget SAP',
    'version' : '1.0',
    'summary': 'bbp',
    'sequence': -1,
    'description': """SAP Query PT. Bahana Bhumiphala Persada""",
    'category': 'bbp',
    'depends' : ['base','web'],
    'data': [
        'views/sapbudget_dashboard.xml',
    ],
    'demo': [
    ],
    'installable': True,
    'application': True,
    'assets': {
        'web.assets_backend': [
            'budget/static/src/components/**/*',
            # 'budget/static/src/components/*/*.xml'
            # 'budget/static/src/components/*/*.scss',
        ],
    },
}
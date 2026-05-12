import {Status} from 'allure-js-commons';

export const allureCategories = [
    {
        name : 'TIMEOUT TESTS',
        messageRegex : 'Timeout',
        matchedStatuses : [Status.FAILED],
    },
]
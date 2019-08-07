import { PolarRegion } from '../../types';

interface IData {
    label:string,
    value:PolarRegion
};

const data:Array<IData> = [
    {
        label: 'Arctic Sea Ice',
        value: 'arctic'
    },
    {
        label: 'Antarctic Sea Ice',
        value: 'antarctic'
    }
];

export default data;
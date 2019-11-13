import { PolarRegion } from '../../types';

interface IData {
  label: string;
  shortLabel: string;
  value: PolarRegion;
}

const data: Array<IData> = [
  {
    label: 'Arctic Sea Ice',
    shortLabel: 'Arctic',
    value: 'arctic',
  },
  {
    label: 'Antarctic Sea Ice',
    shortLabel: 'Antarctic',
    value: 'antarctic',
  },
];

export default data;

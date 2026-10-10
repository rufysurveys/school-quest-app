export interface SchoolOption {
  id: string;
  name: string;
  type: 'Private' | 'Federal Unity' | 'Government';
  zone: string;
}

export const ABUJA_SCHOOLS: SchoolOption[] = [
  { id: 'little-sprout', name: 'Little Sprout International School', type: 'Private', zone: 'Gwarinpa' },
  { id: 'destiny-christian', name: 'Destiny Christian Academy', type: 'Private', zone: 'Garki' },
  { id: 'deeper-life', name: 'Deeper Life High School, Abuja', type: 'Private', zone: 'Kuje' },
  { id: 'faith-academy', name: 'Faith Academy', type: 'Private', zone: 'Kuje' },
  { id: 'stella-maris', name: 'Stella Maris Schools', type: 'Private', zone: 'Area 1, Garki' },
  { id: 'word-of-faith', name: 'Word of Faith Group of Schools', type: 'Private', zone: 'Area 11, Garki' },
  { id: 'the-regent', name: 'The Regent Secondary School', type: 'Private', zone: 'Maitama' },
  { id: 'premiere-academy', name: 'Premiere Academy', type: 'Private', zone: 'Lugbe' },
  { id: 'fgbc-apo', name: "Federal Government Boys' College, Apo", type: 'Federal Unity', zone: 'Apo' },
  { id: 'fggc-bwari', name: "Federal Government Girls' College, Bwari", type: 'Federal Unity', zone: 'Bwari' },
  { id: 'gss-garki', name: 'Government Secondary School, Garki', type: 'Government', zone: 'Area 10, Garki' },
  { id: 'loyola-jesuit', name: 'Loyola Jesuit College, Abuja', type: 'Private', zone: 'Gidan Mangoro' },
  { id: 'model-maitama', name: 'Model Secondary School, Maitama', type: 'Government', zone: 'Maitama' },
  { id: 'army-day', name: 'Army Day Secondary School, Abuja', type: 'Government', zone: 'Mogadishu Cantonment' },
  { id: 'gss-wuse', name: 'Government Secondary School, Wuse', type: 'Government', zone: 'Wuse Zone 3' },
  { id: 'gss-kubwa', name: 'Government Secondary School, Kubwa', type: 'Government', zone: 'Kubwa' },
  { id: 'gss-karu', name: 'Government Secondary School, Karu', type: 'Government', zone: 'Karu' },
  { id: 'ntic-abuja', name: 'Nigerian Tulip International College, Abuja', type: 'Private', zone: 'Wuye' },
  { id: 'fggc-abaji', name: "Federal Government Girls' College, Abaji", type: 'Federal Unity', zone: 'Abaji' },
  { id: 'other', name: 'Others... (Type My School Name)', type: 'Private', zone: 'Custom' }
];

export const ALL_CLASSES = ['SS1', 'SS2', 'SS3', 'JSS1', 'JSS2', 'JSS3'] as const;

export const ALL_DEPARTMENTS = [
  'Science',
  'Humanities / Arts',
  'Business / Commercial',
  'Technology / Trade'
] as const;

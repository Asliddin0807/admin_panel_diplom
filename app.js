let app = [
  {
    name: 'Asl',
    category: 'Mobile'
  },
  {
    name: 'asas',
    category: 'Mobile'
  },
  {
    name: 'asdasdasdasdasdas',
    category: 'Mobile'
  },
  {
    name: 'asdasdasasdasd',
    category: 'Accsesuar'
  },
  {
    name: 'Asasdasdasdasdasdasdasl',
    category: 'Accsesuar'
  },
  {
    name: 'asdasdasdasdasdasdasd',
    category: 'Laptop'
  },
  {
    name: 'ajsdksajda',
    category: 'Laptop'
  }
];

function removeDuplicateCategories(array) {
  let uniqueCategories = new Set(array.map(item => item.category));
  return Array.from(uniqueCategories);
}

let uniqueCategories = removeDuplicateCategories(app);
console.log(uniqueCategories);

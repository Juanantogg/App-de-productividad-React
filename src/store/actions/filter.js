export const setFilterTasks = (filter) => {
  return {
    type: 'SET_FILTER_TASKS',
    payload: filter
  }
}

export const setSearch = (search) => {
  console.log(search)
  return {
    type: 'SET_SEARCH',
    payload: search
  }
}

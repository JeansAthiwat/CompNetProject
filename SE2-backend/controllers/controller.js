const home = async (req, res) => {
  try {
    res.status(200).render('index.ejs')
    } catch (error) {
  console.log(error)
  res.status(500).send('Interval Server Error')
}  
  }

export { home }
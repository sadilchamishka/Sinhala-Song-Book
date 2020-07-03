import React,{useState,useEffect} from 'react';
import {AppBar,Card,Select,MenuItem,Grid,Toolbar,Typography,Container,FormControl} from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { Multiselect } from 'multiselect-react-dropdown';
import Rating from '@material-ui/lab/Rating';

const state = { options: [{name: 'ගීතය', id: 'title'},{name: 'ගායකයා', id: 'singer'},{name: 'ඇල්බම්', id: 'album_name_si'},{name: 'ගී පද', id: 'song'}, {name: 'ජනප්‍රිය', id: 'track_rating'}] };

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  }
}));

export default function Album() {
  const classes = useStyles();

  const [index, setIndex] = useState("sinhala_songs");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [singerList, setsingerList] = useState([]);
  const [querysingerList, setquerysingerList] = useState([]);

  const [searchTags,setSearchTagsList] = useState([]);
  const [autocompleteList,setautocompleteList] = useState([]);

  useEffect(()=>{
    loadLandingPage();
  },[]);

  useEffect(()=>{
    loadsingerCount();
  },[]);


  const loadsingerCount = async () => {
    const response =  await fetch("http://localhost:3001/singercount");
    const data = await response.json();
    setsingerList(data);
  };

  const loadLandingPage = async () => {
    const response =  await fetch("http://localhost:3001/landpage");
    const data = await response.json();
    setResults(data);
  };

  const autocomplete = async (d)=>{
    const response =  await fetch("http://localhost:3001/autocomplete",{
                                    method: 'POST',
                                    headers: {'Content-Type': 'application/json'},   
                                    body: JSON.stringify({  query: d })
                                  });
    
    const data = await response.json();
    setautocompleteList(data);
  };

  const updateSearch = (event)=>{
    var d = event.target.value;
    setSearch(d);
    autocomplete(d);
  };

  const querySong = async ()=>{
    const response =  await fetch("http://localhost:3001/search",{
                                    method: 'POST',
                                    headers: {'Content-Type': 'application/json'},   
                                    body: JSON.stringify({  query: search,  
                                                            tags:searchTags,
                                                            index:index})
                            });

    const data = await response.json();
    setResults(data.hits.hits);
    setquerysingerList(data.aggregations.categories.buckets);
  };

  const onSelect = (selectedList, selectedItem)=> {
    setSearchTagsList(selectedList);
  };

  const onRemove = (selectedList, removedItem)=> {
    setSearchTagsList(selectedList);
  };

  const autocompleteChecked = (event)=> {
    setSearch(event.target.value);
  };

  const changeIndex = (event)=> {
    setIndex(event.target.value);
  };

  return (
    <React.Fragment>
    <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
        </Toolbar>
      </AppBar>
      <main>
        <div className={classes.heroContent}>
        <h1>සිංහල සින්දු  පොත</h1>
        <select value={index} className="dropdown" onChange={changeIndex} variant="outlined">
          <option value={"sinhala_songs"}>{"සියලුම"}</option>
          <option value={"raps"}>{"රැප්"}</option> 
          <option value={"sinhala_songs"}>{"පැරණි පොප්"}</option> 
          <option value={"sinhala_songs"}>{"නූතන පොප්"}</option> 
          <option value={"sinhala_songs"}>{"ච්ත්‍රපට"}</option> 
          <option value={"sinhala_songs"}>{"බයිලා"}</option> 
          <option value={"sinhala_songs"}>{"නාට්‍ය"}</option> 
          <option value={"sinhala_songs"}>{"සම්භාව්ය"}</option> 
          <option value={"sinhala_songs"}>{"සංස්කෘතික"}</option> 
          <option value={"sinhala_songs"}>{"ඉංග්රීසි"}</option> 
          <option value={"sinhala_songs"}>{"උපකරණ"}</option>
        </select>
        <br></br>
        {singerList.map(singer=>(
          <div>
            <label>{singer.key}</label>  &emsp; <label>{singer.doc_count}</label>  &emsp; &emsp;
          </div>
        ))}

        <br></br>
        <input type="text" value={search} onChange={updateSearch}></input>
        <button onClick={querySong}>Search</button>
        <br></br>
            <select value={"***********"} className="dropdown" onChange={autocompleteChecked} variant="outlined">
              {autocompleteList.map(item =>(
                <option value={item._source.title}>{item._source.title}</option>
              ))}
            </select>
        

        <br></br>
        <Multiselect
        selectedValues={state.selectedValue} // Preselected value to persist in dropdown
        onSelect={onSelect} // Function will trigger on select event
        options={state.options} // Options to display in the dropdown
        onRemove={onRemove}
        displayValue="name" // Property name to display in the dropdown options
      />
        </div>

        {querysingerList.map(singer=>(
          <div>
            <label>{singer.key}</label>  &emsp; <label>{singer.doc_count}</label>  &emsp; &emsp;
          </div>
        ))}
        <br></br>

        <Container className={classes.cardGrid} maxWidth="40%">
          {/* End hero unit */}
          <Grid container spacing={6}>
            {results.map((result) => (
              <Grid item key={result} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <Typography gutterBottom variant="h5" component="h2">
                  ගීතය :- {result._source.title}
                  </Typography>
                  <Typography>
                  ගායනය :- {result._source.singer} &emsp;
                  ඇල්බමය :- {result._source.album_name_si}
                  </Typography>
                  <br></br>
                  <Typography>
                    {result._source.song}
                  </Typography> 
                </Card>
                <Rating
                  name="simple-controlled"
                  value={result._source.track_rating/2}
                  readOnly/>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
}
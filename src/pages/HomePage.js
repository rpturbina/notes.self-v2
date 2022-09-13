import React from 'react';
import { Helmet } from 'react-helmet';
import { MdAdd } from 'react-icons/md';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Button from '../components/Button';
import NotesList from '../components/NotesList';
import SearchBar from '../components/SearchBar';
import { searchFilter } from '../utils';
import { archiveNote, deleteNote, getActiveNotes } from '../utils/network-data';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [notes, setNotes] = React.useState([]);
  const [keyword, setKeyword] = React.useState(() => {
    return searchParams.get('keyword') || '';
  });

  React.useEffect(() => {
    getActiveNotes().then(({ data }) => {
      setNotes(data);
    });
  }, []);

  const onKeywordChangeHandler = (keyword) => {
    setSearchParams({ keyword });
    setKeyword(keyword);
  };

  const onDeleteNoteHandler = async (id) => {
    await deleteNote(id);

    const { data } = await getActiveNotes();
    setNotes(data);
  };

  const onArchiveNoteHandler = async (id) => {
    await archiveNote(id);

    const { data } = await getActiveNotes();
    setNotes(data);
  };

  const filteredNotes = searchFilter(notes, keyword);

  return (
    <section className='homepage'>
      <Helmet>
        <title>Home Page - notes.self</title>
      </Helmet>
      <h2>Catatan Aktif</h2>
      <SearchBar keyword={keyword} keywordChange={onKeywordChangeHandler} />
      <NotesList
        notes={filteredNotes}
        onDelete={onDeleteNoteHandler}
        onArchive={onArchiveNoteHandler}
      />
      <div className='homepage__action'>
        <Button title='Tambah' onClick={() => navigate('/notes/new')} icon={<MdAdd />} />
      </div>
    </section>
  );
};

export default HomePage;

// const HomePageWrapper = () => {
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();

//   const keyword = searchParams.get('keyword');

//   const onNavigateToAddPageHandler = () => {
//     navigate('/notes/new');
//   };

//   const onKeywordChangeHandler = (keyword) => {
//     setSearchParams({ keyword });
//   };

//   return (
//     <HomePage
//       navigateToAddPage={onNavigateToAddPageHandler}
//       defaultKeyword={keyword}
//       keywordChange={onKeywordChangeHandler}
//     />
//   );
// };

// class HomePage extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       notes: getActiveNotes(),
//       keyword: props.defaultKeyword || '',
//     };

//     this.onKeywordChangeEventHandler = this.onKeywordChangeEventHandler.bind(this);
//     this.onDeleteNoteEventHandler = this.onDeleteNoteEventHandler.bind(this);
//     this.onArchiveNoteEventHandler = this.onArchiveNoteEventHandler.bind(this);
//   }

//   onKeywordChangeEventHandler(keyword) {
//     this.setState(() => {
//       return {
//         keyword,
//       };
//     });
//     this.props.keywordChange(keyword);
//   }

//   onDeleteNoteEventHandler(id) {
//     deleteNote(id);
//     this.setState(() => {
//       return {
//         notes: getActiveNotes(),
//       };
//     });
//   }

//   onArchiveNoteEventHandler(id) {
//     archiveNote(id);
//     this.setState(() => {
//       return {
//         notes: getActiveNotes(),
//       };
//     });
//   }

//   render() {
//     const notes = searchFilter(this.state.notes, this.state.keyword);
//     return (
//       <section className='homepage'>
//         <Helmet>
//           <title>Home Page - notes.self</title>
//         </Helmet>
//         <h2>Catatan Aktif</h2>
//         <SearchBar keyword={this.state.keyword} keywordChange={this.onKeywordChangeEventHandler} />
//         <NotesList
//           notes={notes}
//           onDelete={this.onDeleteNoteEventHandler}
//           onArchive={this.onArchiveNoteEventHandler}
//         />
//         <div className='homepage__action'>
//           <Button title='Tambah' onClick={this.props.navigateToAddPage} icon={<MdAdd />} />
//         </div>
//       </section>
//     );
//   }
// }

// HomePage.propTypes = {
//   navigateToAddPage: PropTypes.func.isRequired,
//   defaultKeyword: PropTypes.string,
//   keywordChange: PropTypes.func.isRequired,
// };

// export default HomePageWrapper;

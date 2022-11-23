import { useEffect, useState } from 'react';

export function App() {
  // State variables
  const [repo, setRepo] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [archived, setArchived] = useState(false);

  useEffect(() => {
    fetch('https://api.github.com/users/sarutobexx/repos')
      .then((res) => res.json())
      .then((data) => {
        setRepo(data);
      });
  }, []);

  // filter the repo by search
  const filterData = (data, search) => {
    if (!search) {
      return data;
    }

    return data.filter((item) => {
      const itemData = item.name.toUpperCase();
      const textData = search.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
  };

  //formatar update_at for pt-br date
  const formatDate = (date) => {
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();
    const seconds = newDate.getSeconds();
    const ampm = newDate.getHours() > 11 ? 'pm' : 'am';
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  };

  //flatlist for render the repo data
  const renderData = (data) => {
    return data.map((item) => {
      return (
        <div className="card" key={item.id}>
          <div className="card-body">
            <h3 className="card-title">{item.name}</h3>
            <p className="card-text">{item.description}</p>
            <p className="card-text"> {item.language}</p>
            <p className="card-text">
              <small className="text-muted">
                Last Commit: {formatDate(item.updated_at)}
              </small>
            </p>
            <a
              href={`https://github.com/${item.full_name}`}
              className="btn btn-primary"
              target="_blank"
              rel="noreferrer"
            >
              Go to Repo
            </a>
          </div>
        </div>
      );
    });
  };

  //sort in alphabetic or commit date 
  const sortData = (data, sort) => {
    if (sort === 'alphabetic') {
      return data.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    }
    if (sort === 'commit') {
      return data.sort((a, b) => {
        if (a.updated_at < b.updated_at) {
          return -1;
        }
        if (a.updated_at > b.updated_at) {
          return 1;
        }
        return 0;
      });
    }

    return data;
  };

  //show only archived repo = true
  const filterArchived = (data, archived) => {
    if (archived) {
      return data.filter((item) => {
        return item.archived === true;
      });
    }
    return data;
  };

  return (
    <div className="container" style={{ flex: 1, flexDirection: 'column' }}>
      <div className="row" style={{ backgroundColor: '#fff' }}>
        <div className="col-12" style={{}}>
          <h1
            className="text-center"
            style={{
              backgroundColor: '#fff',
              alignSelf: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            Git Repositorys
          </h1>
          <div
            className="input-group mb-3"
            style={{
              flex: 1,
              textAlign: 'center',
              backgroundColor: '#fff',
              borderColor: '#fff',
              borderStyle: 'dashed',
              borderWidth: 1,
              borderRadius: 5,
              alignSelf: 'center',
            }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="basic-addon2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <br />
          <div
            className="input-group mb-3"
            style={{
              textAlign: 'center',

              alignSelf: 'center',
            }}
          >
            Sort By:
            <select
              style={{
                textAlign: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                marginLeft: 5,
                marginTop: 5,
              }}
              className="form-select"
              id="inputGroupSelect01"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option
                value="alphabetic"
                style={{
                  textAlign: 'center',
                }}
              >
                Name
              </option>
              <option
                value="commit"
                style={{
                  textAlign: 'center',
                }}
              >
                Commit
              </option>
            </select>
          </div>
          <br />
          <div className="form-group">
            <div
              className="form-check"
              style={{
                textAlign: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                marginLeft: 5,
                marginTop: 5,
              }}
            >
              <input
                style={{
                  textAlign: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginLeft: 5,
                  marginTop: 5,
                }}
                className="form-check-input"
                type="checkbox"
                value={archived}
                onChange={(e) => setArchived(e.target.checked)}
                id="flexCheckDefault"
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Show only archived repositories
              </label>
              <br />
            </div>
          </div>
          <div
            className="row"
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              marginTop: '20px',
              marginBottom: '20px',
              width: '100%',
              border: '1px solid #E9E9E9',
              borderRadius: '3px',
              padding: '1px',
              backgroundColor: '#F5F5F5',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
              paddingBottom: '10px',
            }}
          >
            {renderData(
              sortData(filterArchived(filterData(repo, search), archived), sort)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

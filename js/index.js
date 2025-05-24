document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#github-form');
  const searchInput = document.querySelector('#search');
  const userList = document.querySelector('#user-list');
  const reposList = document.querySelector('#repos-list');

  // Create and append toggle button
  const toggleButton = document.createElement('button');
  toggleButton.textContent = 'Switch to Repo Search';
  form.appendChild(toggleButton);

  // Track search mode
  let searchMode = 'user'; // or 'repo'

  toggleButton.addEventListener('click', (e) => {
    e.preventDefault();
    searchMode = searchMode === 'user' ? 'repo' : 'user';
    toggleButton.textContent =
      searchMode === 'user' ? 'Switch to Repo Search' : 'Switch to User Search';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;
    userList.innerHTML = '';
    reposList.innerHTML = '';
    searchMode === 'user' ? searchUsers(query) : searchRepos(query);
  });

  function searchUsers(query) {
    fetch(`https://api.github.com/search/users?q=${query}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        data.items.forEach((user) => {
          const li = document.createElement('li');

          const avatar = document.createElement('img');
          avatar.src = user.avatar_url;
          avatar.alt = `${user.login}'s avatar`;
          avatar.style.width = '50px';
          avatar.style.height = '50px';

          const name = document.createElement('p');
          name.textContent = user.login;

          const profileLink = document.createElement('a');
          profileLink.href = user.html_url;
          profileLink.textContent = 'View Profile';
          profileLink.target = '_blank';

          li.appendChild(avatar);
          li.appendChild(name);
          li.appendChild(profileLink);

          li.addEventListener('click', () => {
            fetchUserRepos(user.login);
          });

          userList.appendChild(li);
        });
      })
      .catch((err) => console.error('User search error:', err));
  }

  function fetchUserRepos(username) {
    reposList.innerHTML = '';
    fetch(`https://api.github.com/users/${username}/repos`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    })
      .then((res) => res.json())
      .then((repos) => {
        repos.forEach((repo) => {
          const li = document.createElement('li');
          const link = document.createElement('a');
          link.href = repo.html_url;
          link.textContent = repo.name;
          link.target = '_blank';
          li.appendChild(link);
          reposList.appendChild(li);
        });
      })
      .catch((err) => console.error('Repo fetch error:', err));
  }

  function searchRepos(query) {
    fetch(`https://api.github.com/search/repositories?q=${query}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        data.items.forEach((repo) => {
          const li = document.createElement('li');

          const name = document.createElement('p');
          name.textContent = repo.full_name;

          const link = document.createElement('a');
          link.href = repo.html_url;
          link.textContent = 'View Repository';
          link.target = '_blank';

          li.appendChild(name);
          li.appendChild(link);

          reposList.appendChild(li);
        });
      })
      .catch((err) => console.error('Repo search error:', err));
  }
});

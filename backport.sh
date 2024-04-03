git reset HEAD~1
rm ./backport.sh
git cherry-pick 2cf943207c6e5853968ae6e5a2ff687f9ebf2c16
echo 'Resolve conflicts and force push this branch'

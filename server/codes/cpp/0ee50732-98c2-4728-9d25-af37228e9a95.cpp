#include <bits/stdc++.h>
  using namespace std;

  int main() {
    int t;
    cin>>t;
    while(t--)
    {
    int n;
    cin>>n;
    vector<int> num(n);
    for(int i=0; i<n; i++){
      cin>>num[i];
    }
    
    stack<int> s;
    vector<int> ans(n,-1);
    
    for(int i=0; i<n; i++)
    {
      while(!s.empty() && num[s.top()] < num[i])
      {
        ans[s.top()] = num[i];
        s.pop();
      }
      s.push(i);
    }
    
    for(int i=0; i<n; i++){
      cout<<ans[i]<<" ";
    }
    cout<<endl;
    }
    return 0;

  }
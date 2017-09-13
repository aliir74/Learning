var ans = 0
for(var i = 2; i < process.argv.length; i++) {
    ans += Number(process.argv[i])
}
console.log(ans)
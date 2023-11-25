<template lang="">
    <header>
        <nav>
            <div class="nav-item">
            <router-link to="/">
                <img src="/home_small.png" alt="Logo" />
                <span>Home</span>
            </router-link>
            </div>
            <div class="nav-item">
            <router-link to="/dataset">
                <img src="/database_icon.png" alt="Logo" />
                <span>Dataset</span>
            </router-link>
            </div>
        </nav>
    </header>
</template>
<script>

export default {
    data() {
        return {}
    }
}
</script>
<style>
header {
    padding: 20px;
    background-color: #fff;
    height: 80px;
    border-bottom: 1px solid #ccc;
}

header nav{
    display: flex;
    justify-content: center;
    align-items: center;
}

.nav-item {
    display: flex;
    align-items: center;
}

header nav  a{
    margin: 0 20px;
}

header nav  img{
    margin: 0 10px;
}

</style>
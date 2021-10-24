<template>
  <q-page class="px-5">
    <div class="b-landing">
      <section class="b-landing__start pb-9">
        <div class="b-landing__title">Experience the future of Billing today.</div>

        <div class="b-landing__start-desc">
          BillBird is a next-generation solution for GST Billing, Khata Book, Inventory, Customer,
          and Supplier management. With very cheap and competitive pricing, grow your business at a
          faster pace with BillBird.
        </div>

        <div class="text-center">
          <q-btn unelevated no-caps outline label="Try it for free" />
        </div>
      </section>

      <section class="b-landing__usp q-pt-xl">
        <div class="grid grid-cols-1 sm:grid-cols-2 items-center pb-6">
          <div
            class="w-[70%] m-auto py-2 sm:py-0"
            :class="$q.screen.width < 600 ? 'order-last' : 'order-none'"
          >
            <img class="max-w-full" src="../assets/img2.svg" alt="cloud first" />
          </div>

          <div class="flex flex-col space-y-2 py-2 sm:py-0">
            <div class="b-landing__usp-title">Cloud first</div>
            <div class="text-lg text-blue-grey-6">
              The entire BillBird suite is on the web thus eliminating the need to install anything.
              Your data is synced in real-time with our cloud, making BillBird universally
              accessible on any device. An optional desktop app is also available.
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 items-center pb-6">
          <div class="flex flex-col space-y-2 py-2 sm:py-0">
            <div class="b-landing__usp-title">Retail & Wholesale chain support</div>
            <div class="text-lg text-blue-grey-6">
              BillBird has built-in support for both individual and Chain Retail/Wholesale
              businesses. View and manage the entire data of your child branches directly from your
              dashboard. With Global Inventory and Analytics graphs, BillBird provides a 360
              <sup>o</sup>
              insight of your bussiness.
            </div>
          </div>

          <div class="w-[70%] m-auto py-2 sm:py-0">
            <img class="max-w-full" src="../assets/img4.svg" alt="chain" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 items-center pb-6">
          <div
            class="w-[70%] m-auto py-2 sm:py-0"
            :class="$q.screen.width < 600 ? 'order-last' : 'order-none'"
          >
            <img class="max-w-full" src="../assets/img5.svg" alt="management" />
          </div>

          <div class="flex flex-col space-y-2 py-2 sm:py-0">
            <div class="b-landing__usp-title">
              360
              <sup>o</sup>
              Business management
            </div>
            <div class="text-lg text-blue-grey-6">
              BillBird has support GST Billing, Khata Book, Inventory, Customer, and Supplier
              management with more new features coming soon.
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 items-center pb-6">
          <div class="flex flex-col space-y-2 py-2 sm:py-0">
            <div class="b-landing__usp-title">Minimal, Simple UI</div>
            <div class="text-lg text-blue-grey-6">
              The design principles behind BillBird are well-thought keeping a comfortable end-user
              experience in mind. User-friendly components with fluid action buttons will make it
              easier to work with BillBird.
            </div>
          </div>
          <div class="w-[70%] m-auto py-2 sm:py-0">
            <img class="max-w-full" src="../assets/img3.svg" alt="" />
          </div>
        </div>
      </section>
    </div>

    <div
      class="mt-20 mb-5 p-3 max-w-[1000px] m-auto flex justify-center items-center text-blue-grey-9"
    >
      Copyright &nbsp;
      <q-icon name="copyright" />
      &nbsp;
      {{ new Date().getFullYear() }}, BillBird LLP
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.b-landing {
  &__title {
    font-family: 'Georgia', sans-serif;

    @apply md:(text-8xl) max-w-[550px] text-5xl sm:(text-6xl text-center max-w-[768px] \!leading-tight);
    @apply text-left leading-snug m-auto;
  }

  &__start {
    @apply flex flex-col items-center sm:pt-16 pt-10 space-y-6;

    &-desc {
      color: $blue-grey-5;

      @apply sm:(text-xl text-center) text-lg text-left \!leading-relaxed max-w-[768px] font-normal m-auto;
    }
  }
  &__usp {
    @apply max-w-[1000px] m-auto;

    &-title {
      font-family: 'Georgia', sans-serif;
      @apply text-3xl;
    }

    .svg {
      max-width: 70%;
      display: block;
      margin: auto;
    }
  }
}
</style>

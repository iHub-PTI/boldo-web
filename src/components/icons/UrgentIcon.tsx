import React from 'react'

const UrgentIcon = props => (
  <svg width={54} height={18} fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <rect width={54} height={18} rx={4} fill='#E8431F' />
    <path
      d='M10.102 10.678V7.545h1.512V13h-1.452v-.99h-.057a1.61 1.61 0 0 1-.614.77c-.284.194-.631.291-1.04.291-.365 0-.686-.083-.963-.249a1.709 1.709 0 0 1-.65-.706c-.154-.306-.232-.671-.234-1.098V7.545h1.512v3.204c.003.321.09.576.26.763.17.187.399.28.685.28.182 0 .353-.04.511-.124a.976.976 0 0 0 .384-.376c.1-.166.148-.37.146-.614ZM13.324 13V7.545h1.467v.952h.057c.1-.338.266-.594.5-.767.235-.175.505-.263.81-.263a2.287 2.287 0 0 1 .476.054v1.342a2.648 2.648 0 0 0-.64-.082 1.21 1.21 0 0 0-.596.146 1.072 1.072 0 0 0-.56.987V13h-1.514Zm6.796 2.16c-.49 0-.91-.068-1.261-.203a2.092 2.092 0 0 1-.83-.544 1.67 1.67 0 0 1-.402-.774l1.399-.188c.043.109.11.21.202.305.093.095.215.17.366.228.154.059.341.088.561.088.33 0 .6-.08.813-.241.216-.159.323-.425.323-.799v-.998h-.063a1.438 1.438 0 0 1-.299.43 1.503 1.503 0 0 1-.511.33 1.964 1.964 0 0 1-.746.128 2.24 2.24 0 0 1-1.118-.284c-.334-.192-.6-.484-.8-.877-.196-.396-.294-.895-.294-1.499 0-.618.1-1.134.302-1.548.2-.415.468-.725.802-.93a2.074 2.074 0 0 1 1.105-.31c.305 0 .56.053.767.157.206.101.371.23.497.383.128.152.226.3.295.448h.056v-.917h1.503v5.508c0 .464-.114.852-.341 1.165a2.052 2.052 0 0 1-.945.703c-.4.159-.86.238-1.381.238Zm.032-3.374c.243 0 .45-.06.617-.182.171-.123.301-.298.391-.525.093-.23.139-.504.139-.824 0-.32-.045-.597-.135-.831-.09-.237-.22-.42-.39-.55a.994.994 0 0 0-.622-.196.981.981 0 0 0-.629.203c-.17.132-.3.317-.387.554-.088.236-.131.51-.131.82 0 .315.043.587.131.817.09.227.219.403.387.529.17.123.38.184.629.184Zm6.824 1.32c-.56 0-1.044-.113-1.449-.34a2.335 2.335 0 0 1-.93-.973c-.218-.422-.327-.92-.327-1.495 0-.561.11-1.054.327-1.478.218-.423.524-.754.92-.99.397-.237.864-.356 1.399-.356.36 0 .695.058 1.005.174.312.114.585.286.817.515.234.23.416.519.546.867.13.345.196.75.196 1.214v.416h-4.606v-.938h3.182c0-.217-.048-.41-.142-.579a1.017 1.017 0 0 0-.395-.394 1.124 1.124 0 0 0-.578-.145c-.23 0-.433.053-.611.16a1.12 1.12 0 0 0-.412.422c-.1.175-.15.37-.153.586v.891c0 .27.05.503.15.7.101.196.244.348.43.455.184.106.403.16.656.16.168 0 .322-.024.462-.072a.927.927 0 0 0 .586-.561l1.399.093a1.91 1.91 0 0 1-.437.88c-.218.249-.5.443-.845.583-.343.137-.74.206-1.19.206Zm5.504-3.26V13h-1.513V7.545h1.442v.963h.064c.12-.317.323-.568.607-.753.284-.187.629-.28 1.033-.28.38 0 .71.082.991.248.282.166.5.402.657.71.156.306.234.67.234 1.094V13h-1.512V9.797c.002-.334-.083-.594-.256-.781-.173-.19-.41-.284-.714-.284-.203 0-.383.043-.54.13a.915.915 0 0 0-.362.384c-.085.166-.129.366-.131.6Zm8.109-2.3v1.136h-3.285V7.545h3.285Zm-2.54-1.307h1.514v5.085c0 .14.021.248.064.327a.353.353 0 0 0 .177.16c.078.03.168.046.27.046.071 0 .142-.006.213-.018l.163-.032.238 1.125a4.26 4.26 0 0 1-.32.082 2.565 2.565 0 0 1-.5.06 2.3 2.3 0 0 1-.959-.145 1.338 1.338 0 0 1-.635-.518c-.152-.235-.227-.53-.224-.888V6.239Zm6.453 6.868c-.562 0-1.044-.114-1.45-.341a2.335 2.335 0 0 1-.93-.973c-.218-.422-.326-.92-.326-1.495 0-.561.108-1.054.326-1.478.218-.423.525-.754.92-.99.398-.237.864-.356 1.4-.356.36 0 .694.058 1.004.174.313.114.585.286.817.515.234.23.417.519.547.867.13.345.195.75.195 1.214v.416H42.4v-.938h3.182c0-.217-.047-.41-.142-.579a1.017 1.017 0 0 0-.394-.394 1.124 1.124 0 0 0-.579-.145c-.23 0-.433.053-.61.16a1.12 1.12 0 0 0-.413.422c-.1.175-.15.37-.152.586v.891c0 .27.05.503.149.7.102.196.245.348.43.455.184.106.403.16.657.16.167 0 .321-.024.461-.072a.926.926 0 0 0 .586-.561l1.4.093a1.91 1.91 0 0 1-.438.88c-.217.249-.5.443-.845.583-.343.137-.74.206-1.19.206Z'
      fill='#fff'
    />
  </svg>
)

export default UrgentIcon